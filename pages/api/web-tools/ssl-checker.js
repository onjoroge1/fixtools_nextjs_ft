/**
 * SSL Certificate Checker API
 * POST /api/web-tools/ssl-checker
 * 
 * Checks SSL certificate validity, expiration, issuer, and security
 * Requires payment for batch processing (multiple domains) or exceeding rate limits
 */

import { checkPaymentRequirement } from '../../../lib/config/pricing';
import { verifyProcessingPass } from '../../../lib/payments/payment-utils';
import * as tls from 'tls';
import * as dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);

// Get user plan from session
async function getUserPlanFromSession(sessionId) {
  if (!sessionId) return 'free';
  
  try {
    const hasValidPass = await verifyProcessingPass(sessionId);
    if (hasValidPass) {
      return 'day_pass';
    }
  } catch (e) {
    // Invalid session
  }
  return 'free';
}

// Get SSL certificate information
async function getSSLCertificate(hostname, port = 443) {
  return new Promise((resolve, reject) => {
    const options = {
      host: hostname,
      port: port,
      rejectUnauthorized: false, // We want to check even invalid certs
    };

    const socket = tls.connect(options, () => {
      const cert = socket.getPeerCertificate(true);
      const cipher = socket.getCipher();
      
      socket.end();
      
      if (!cert || Object.keys(cert).length === 0) {
        reject(new Error('No certificate found'));
        return;
      }

      // Parse certificate information
      const now = new Date();
      const validFrom = new Date(cert.valid_from);
      const validTo = new Date(cert.valid_to);
      const daysUntilExpiry = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));
      const isExpired = validTo < now;
      const isExpiringSoon = daysUntilExpiry <= 30 && !isExpired;
      const isValid = !isExpired && validFrom <= now;

      resolve({
        hostname,
        port,
        valid: isValid,
        expired: isExpired,
        expiringSoon: isExpiringSoon,
        validFrom: validFrom.toISOString(),
        validTo: validTo.toISOString(),
        daysUntilExpiry: daysUntilExpiry,
        issuer: {
          commonName: cert.issuer?.CN || 'Unknown',
          organization: cert.issuer?.O || 'Unknown',
          country: cert.issuer?.C || 'Unknown',
        },
        subject: {
          commonName: cert.subject?.CN || hostname,
          organization: cert.subject?.O || 'Unknown',
          country: cert.subject?.C || 'Unknown',
          altNames: (() => {
            const altNames = cert.subjectaltname;
            if (!altNames) return [];
            // Handle string format (e.g., "DNS:example.com, DNS:www.example.com")
            if (typeof altNames === 'string') {
              return altNames.split(',').map(name => name.trim().replace(/^DNS:/i, ''));
            }
            // Handle array format
            if (Array.isArray(altNames)) {
              return altNames.map(name => typeof name === 'string' ? name.replace(/^DNS:/i, '') : String(name));
            }
            return [];
          })(),
        },
        fingerprint: cert.fingerprint256 || cert.fingerprint || 'Unknown',
        serialNumber: cert.serialNumber || 'Unknown',
        signatureAlgorithm: cert.signatureAlgorithm || 'Unknown',
        publicKey: {
          algorithm: cert.pubkey?.algo || 'Unknown',
          bits: cert.pubkey?.bits || 0,
        },
        cipher: {
          name: cipher?.name || 'Unknown',
          version: cipher?.version || 'Unknown',
        },
        protocol: socket.getProtocol() || 'Unknown',
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('error', (error) => {
      reject(new Error(`SSL connection failed: ${error.message}`));
    });

    socket.setTimeout(10000); // 10 second timeout
    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('SSL connection timeout'));
    });
  });
}

// Resolve domain to IP (for validation)
async function resolveDomain(hostname) {
  try {
    const result = await dnsLookup(hostname);
    return result.address;
  } catch (error) {
    throw new Error(`DNS resolution failed: ${error.message}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported' 
    });
  }

  try {
    const { domain, domains = [], port = 443, sessionId } = req.body;

    // Validate domain(s)
    const allDomains = domains.length > 0 ? domains : (domain ? [domain] : []);
    
    if (allDomains.length === 0) {
      return res.status(400).json({
        error: 'Invalid domain',
        message: 'Please provide at least one valid domain'
      });
    }

    // Validate each domain
    const validDomains = [];
    for (const testDomain of allDomains) {
      try {
        // Remove protocol if present
        let cleanDomain = testDomain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
        
        // Remove port if present
        cleanDomain = cleanDomain.split(':')[0];
        
        // Basic domain validation
        if (!cleanDomain || cleanDomain.length < 3) {
          throw new Error('Invalid domain format');
        }
        
        // Check for localhost/private IPs
        if (
          cleanDomain === 'localhost' ||
          cleanDomain === '127.0.0.1' ||
          cleanDomain.startsWith('192.168.') ||
          cleanDomain.startsWith('10.') ||
          cleanDomain.startsWith('172.16.') ||
          cleanDomain.startsWith('172.17.') ||
          cleanDomain.startsWith('172.18.') ||
          cleanDomain.startsWith('172.19.') ||
          cleanDomain.startsWith('172.2') ||
          cleanDomain.startsWith('172.3') ||
          cleanDomain.endsWith('.local')
        ) {
          throw new Error('Private and localhost domains are not allowed');
        }
        
        validDomains.push(cleanDomain);
      } catch (e) {
        return res.status(400).json({
          error: 'Invalid domain',
          message: `Please provide a valid domain for ${testDomain}. Error: ${e.message}`
        });
      }
    }

    const domainCount = validDomains.length;
    const userPlan = await getUserPlanFromSession(sessionId);
    
    // Check payment requirement for batch (4+ domains require payment)
    if (domainCount >= 4) {
      const batchRequirement = checkPaymentRequirement('web-tools', 0, domainCount, userPlan);
      if (batchRequirement.requiresPayment && batchRequirement.reason === 'batch') {
        const hasValidPass = await verifyProcessingPass(sessionId);
        if (!hasValidPass) {
          return res.status(402).json({
            error: 'Payment required',
            message: `Batch processing (${domainCount} domains) requires a Processing Pass. Free tier allows up to 3 domains at a time.`,
            paymentRequired: true,
            reason: 'batch',
            domainCount: domainCount,
            requirement: batchRequirement,
          });
        }
      }
    }

    // Check rate limits (free tier: 5 checks per day)
    const rateLimitRequirement = checkPaymentRequirement('web-tools', 0, 1, userPlan);
    if (rateLimitRequirement.requiresPayment && rateLimitRequirement.reason === 'rate_limit') {
      const hasValidPass = await verifyProcessingPass(sessionId);
      if (!hasValidPass) {
        return res.status(402).json({
          error: 'Payment required',
          message: 'Daily rate limit exceeded. A Processing Pass is required for unlimited SSL checks.',
          paymentRequired: true,
          reason: 'rate_limit',
          requirement: rateLimitRequirement,
        });
      }
    }

    // Process each domain
    const results = [];
    
    for (const domain of validDomains) {
      try {
        // Resolve domain first
        await resolveDomain(domain);
        
        // Get SSL certificate
        const certInfo = await getSSLCertificate(domain, port);
        results.push(certInfo);
      } catch (error) {
        console.error(`Error checking SSL for ${domain}:`, error);
        results.push({
          hostname: domain,
          port: port,
          error: error.message || 'Failed to check SSL certificate',
          timestamp: new Date().toISOString(),
        });
      }
    }

    return res.status(200).json({
      success: true,
      results: results,
      count: results.length,
      message: `SSL check completed for ${results.length} domain(s)`,
    });

  } catch (error) {
    console.error('SSL check error:', error);
    return res.status(500).json({
      error: 'SSL check failed',
      message: error.message || 'Failed to check SSL certificate. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    });
  }
}


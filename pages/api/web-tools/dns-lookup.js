/**
 * DNS Lookup API
 * POST /api/web-tools/dns-lookup
 * 
 * Performs DNS lookups for multiple record types (A, AAAA, MX, TXT, CNAME, NS, SOA, PTR)
 * Requires payment for batch processing (4+ domains) or exceeding rate limits
 */

import { checkPaymentRequirement } from '../../../lib/config/pricing';
import { verifyProcessingPass } from '../../../lib/payments/payment-utils';
import * as dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);
const dnsResolve4 = promisify(dns.resolve4);
const dnsResolve6 = promisify(dns.resolve6);
const dnsResolveMx = promisify(dns.resolveMx);
const dnsResolveTxt = promisify(dns.resolveTxt);
const dnsResolveCname = promisify(dns.resolveCname);
const dnsResolveNs = promisify(dns.resolveNs);
const dnsResolveSoa = promisify(dns.resolveSoa);
const dnsReverse = promisify(dns.reverse);

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

// Perform DNS lookup for a specific record type
async function lookupDNSRecord(domain, recordType) {
  const results = {
    domain,
    recordType,
    records: [],
    error: null,
    timestamp: new Date().toISOString(),
  };

  try {
    switch (recordType.toUpperCase()) {
      case 'A':
        try {
          const addresses = await dnsResolve4(domain);
          results.records = addresses.map(addr => ({ value: addr, ttl: null }));
        } catch (e) {
          // Try lookup as fallback
          try {
            const lookup = await dnsLookup(domain, { family: 4 });
            results.records = [{ value: lookup.address, ttl: null }];
          } catch (e2) {
            throw e;
          }
        }
        break;

      case 'AAAA':
        try {
          const addresses = await dnsResolve6(domain);
          results.records = addresses.map(addr => ({ value: addr, ttl: null }));
        } catch (e) {
          if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') {
            throw e;
          }
          results.records = [];
        }
        break;

      case 'MX':
        try {
          const mxRecords = await dnsResolveMx(domain);
          results.records = mxRecords.map(mx => ({
            priority: mx.priority,
            exchange: mx.exchange,
            value: `${mx.priority} ${mx.exchange}`,
            ttl: null,
          }));
        } catch (e) {
          if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') {
            throw e;
          }
          results.records = [];
        }
        break;

      case 'TXT':
        try {
          const txtRecords = await dnsResolveTxt(domain);
          results.records = txtRecords.map(txt => ({
            value: Array.isArray(txt) ? txt.join('') : txt,
            ttl: null,
          }));
        } catch (e) {
          if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') {
            throw e;
          }
          results.records = [];
        }
        break;

      case 'CNAME':
        try {
          const cnameRecords = await dnsResolveCname(domain);
          results.records = cnameRecords.map(cname => ({ value: cname, ttl: null }));
        } catch (e) {
          if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') {
            throw e;
          }
          results.records = [];
        }
        break;

      case 'NS':
        try {
          const nsRecords = await dnsResolveNs(domain);
          results.records = nsRecords.map(ns => ({ value: ns, ttl: null }));
        } catch (e) {
          if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') {
            throw e;
          }
          results.records = [];
        }
        break;

      case 'SOA':
        try {
          const soaRecord = await dnsResolveSoa(domain);
          results.records = [{
            nsname: soaRecord.nsname,
            hostmaster: soaRecord.hostmaster,
            serial: soaRecord.serial,
            refresh: soaRecord.refresh,
            retry: soaRecord.retry,
            expire: soaRecord.expire,
            minttl: soaRecord.minttl,
            value: `${soaRecord.nsname} ${soaRecord.hostmaster} ${soaRecord.serial} ${soaRecord.refresh} ${soaRecord.retry} ${soaRecord.expire} ${soaRecord.minttl}`,
            ttl: null,
          }];
        } catch (e) {
          if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') {
            throw e;
          }
          results.records = [];
        }
        break;

      case 'PTR':
        // PTR records require IP address
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipRegex.test(domain)) {
          throw new Error('PTR records require an IP address, not a domain name');
        }
        try {
          const ptrRecords = await dnsReverse(domain);
          results.records = ptrRecords.map(ptr => ({ value: ptr, ttl: null }));
        } catch (e) {
          if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') {
            throw e;
          }
          results.records = [];
        }
        break;

      case 'ALL':
        // Lookup all record types (avoid recursion by calling DNS functions directly)
        const allResults = {};
        const recordTypes = ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS', 'SOA'];
        
        for (const type of recordTypes) {
          try {
            let typeRecords = [];
            
            switch (type) {
              case 'A':
                try {
                  const addresses = await dnsResolve4(domain);
                  typeRecords = addresses.map(addr => ({ value: addr, ttl: null }));
                } catch (e) {
                  if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') {
                    throw e;
                  }
                }
                break;
              case 'AAAA':
                try {
                  const addresses = await dnsResolve6(domain);
                  typeRecords = addresses.map(addr => ({ value: addr, ttl: null }));
                } catch (e) {
                  if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') {
                    throw e;
                  }
                }
                break;
              case 'MX':
                try {
                  const mxRecords = await dnsResolveMx(domain);
                  typeRecords = mxRecords.map(mx => ({
                    priority: mx.priority,
                    exchange: mx.exchange,
                    value: `${mx.priority} ${mx.exchange}`,
                    ttl: null,
                  }));
                } catch (e) {
                  if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') {
                    throw e;
                  }
                }
                break;
              case 'TXT':
                try {
                  const txtRecords = await dnsResolveTxt(domain);
                  typeRecords = txtRecords.map(txt => ({
                    value: Array.isArray(txt) ? txt.join('') : txt,
                    ttl: null,
                  }));
                } catch (e) {
                  if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') {
                    throw e;
                  }
                }
                break;
              case 'CNAME':
                try {
                  const cnameRecords = await dnsResolveCname(domain);
                  typeRecords = cnameRecords.map(cname => ({ value: cname, ttl: null }));
                } catch (e) {
                  if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') {
                    throw e;
                  }
                }
                break;
              case 'NS':
                try {
                  const nsRecords = await dnsResolveNs(domain);
                  typeRecords = nsRecords.map(ns => ({ value: ns, ttl: null }));
                } catch (e) {
                  if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') {
                    throw e;
                  }
                }
                break;
              case 'SOA':
                try {
                  const soaRecord = await dnsResolveSoa(domain);
                  typeRecords = [{
                    nsname: soaRecord.nsname,
                    hostmaster: soaRecord.hostmaster,
                    serial: soaRecord.serial,
                    refresh: soaRecord.refresh,
                    retry: soaRecord.retry,
                    expire: soaRecord.expire,
                    minttl: soaRecord.minttl,
                    value: `${soaRecord.nsname} ${soaRecord.hostmaster} ${soaRecord.serial} ${soaRecord.refresh} ${soaRecord.retry} ${soaRecord.expire} ${soaRecord.minttl}`,
                    ttl: null,
                  }];
                } catch (e) {
                  if (e.code !== 'ENODATA' && e.code !== 'ENOTFOUND') {
                    throw e;
                  }
                }
                break;
            }
            
            if (typeRecords.length > 0) {
              allResults[type] = typeRecords;
            }
          } catch (e) {
            // Skip failed record types
          }
        }
        
        // Convert to array format for display
        results.records = Object.keys(allResults).map(type => ({
          type,
          records: allResults[type],
        }));
        break;

      default:
        throw new Error(`Unsupported record type: ${recordType}`);
    }
  } catch (error) {
    results.error = error.message || 'DNS lookup failed';
  }

  return results;
}

// Validate domain
function validateDomain(domain) {
  if (!domain || domain.trim().length < 3) {
    throw new Error('Invalid domain format');
  }

  // Remove protocol if present
  let cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  // Remove port if present
  cleanDomain = cleanDomain.split(':')[0];
  
  // Basic domain validation
  const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  if (!domainRegex.test(cleanDomain) && !ipRegex.test(cleanDomain)) {
    throw new Error('Invalid domain or IP address format');
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

  return cleanDomain;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported' 
    });
  }

  try {
    const { domain, domains = [], recordType = 'ALL', sessionId } = req.body;

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
        const cleanDomain = validateDomain(testDomain);
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
          message: 'Daily rate limit exceeded. A Processing Pass is required for unlimited DNS lookups.',
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
        const dnsResult = await lookupDNSRecord(domain, recordType);
        results.push(dnsResult);
      } catch (error) {
        console.error(`Error looking up DNS for ${domain}:`, error);
        results.push({
          domain,
          recordType,
          records: [],
          error: error.message || 'Failed to lookup DNS records',
          timestamp: new Date().toISOString(),
        });
      }
    }

    return res.status(200).json({
      success: true,
      results: results,
      count: results.length,
      message: `DNS lookup completed for ${results.length} domain(s)`,
    });

  } catch (error) {
    console.error('DNS lookup error:', error);
    return res.status(500).json({
      error: 'DNS lookup failed',
      message: error.message || 'Failed to lookup DNS records. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    });
  }
}


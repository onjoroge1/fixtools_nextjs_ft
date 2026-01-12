import CustomHead from '@/components/CustomHead';
import Link from 'next/link';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function Terms() {
  const canonicalUrl = `${siteHost}/terms`;
  const currentYear = new Date().getFullYear();

  return (
    <>
      <CustomHead
        title="Terms of Service"
        metaDescription="FixTools Terms of Service - Read our terms and conditions for using our free online tools. Understand your rights and responsibilities when using FixTools services."
        ogImageUrl="/programming_tools.jpg"
        ogImageAlt="FixTools terms of service"
        ogUrl={canonicalUrl}
        keywords="terms of service, terms and conditions, user agreement, service terms, legal terms, website terms"
      />
      <main
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '3rem 1rem',
          lineHeight: 1.6,
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
          Terms of Service
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.1rem' }}>
          <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Agreement to Terms
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            By accessing or using FixTools ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access or use the Service. These Terms constitute a legally binding agreement between you and FixTools.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            FixTools provides a collection of free online tools for developers, creators, and marketers. These tools are provided "as-is" for your convenience and use. By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Description of Service
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            FixTools offers a variety of web-based utilities and tools, including but not limited to:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>JSON, HTML, CSS, and text manipulation tools</li>
            <li style={{ marginBottom: '0.5rem' }}>Image processing and conversion tools</li>
            <li style={{ marginBottom: '0.5rem' }}>PDF manipulation and conversion tools</li>
            <li style={{ marginBottom: '0.5rem' }}>SEO and web development utilities</li>
            <li style={{ marginBottom: '0.5rem' }}>AI-powered tools and features</li>
            <li style={{ marginBottom: '0.5rem' }}>Conversion calculators and utilities</li>
          </ul>
          <p style={{ marginBottom: '1rem' }}>
            Most tools process data entirely in your browser, while some features may require server-side processing. We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Use of Service
          </h2>
          
          <h3 style={{ fontSize: '1.4rem', marginTop: '1.5rem', marginBottom: '0.75rem', fontWeight: '600' }}>
            Permitted Use
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            You may use FixTools for lawful purposes only. You agree to use the Service in accordance with all applicable laws, regulations, and these Terms. You are responsible for ensuring that your use of the Service complies with all applicable laws in your jurisdiction.
          </p>

          <h3 style={{ fontSize: '1.4rem', marginTop: '1.5rem', marginBottom: '0.75rem', fontWeight: '600' }}>
            Prohibited Use
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            You agree not to use the Service to:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Submit unlawful, illegal, or fraudulent content</li>
            <li style={{ marginBottom: '0.5rem' }}>Transmit malicious code, viruses, or harmful software</li>
            <li style={{ marginBottom: '0.5rem' }}>Submit sensitive personal data (e.g., credit card numbers, social security numbers) without proper authorization</li>
            <li style={{ marginBottom: '0.5rem' }}>Violate any intellectual property rights or proprietary rights</li>
            <li style={{ marginBottom: '0.5rem' }}>Attempt to gain unauthorized access to our systems or networks</li>
            <li style={{ marginBottom: '0.5rem' }}>Use automated systems to abuse or overload our services</li>
            <li style={{ marginBottom: '0.5rem' }}>Interfere with or disrupt the Service or servers</li>
            <li style={{ marginBottom: '0.5rem' }}>Collect or harvest information about other users</li>
            <li style={{ marginBottom: '0.5rem' }}>Use the Service for any commercial purpose that competes with FixTools</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Disclaimer of Warranties
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            <strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</strong> To the fullest extent permitted by applicable law, FixTools disclaims all warranties, express or implied, including but not limited to:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
            <li style={{ marginBottom: '0.5rem' }}>Warranties that the Service will be uninterrupted, timely, secure, or error-free</li>
            <li style={{ marginBottom: '0.5rem' }}>Warranties regarding the accuracy, reliability, or quality of any information obtained through the Service</li>
            <li style={{ marginBottom: '0.5rem' }}>Warranties that defects will be corrected</li>
          </ul>
          <p style={{ marginBottom: '1rem' }}>
            You acknowledge that you use the Service at your own risk. We do not guarantee that the Service will meet your requirements or that the results obtained from using the Service will be accurate or reliable. You are responsible for verifying outputs before using them in production environments.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Limitation of Liability
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            To the fullest extent permitted by applicable law, FixTools and its affiliates, officers, directors, employees, agents, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Loss of profits, revenue, data, or use</li>
            <li style={{ marginBottom: '0.5rem' }}>Business interruption or loss of business opportunities</li>
            <li style={{ marginBottom: '0.5rem' }}>Cost of substitute goods or services</li>
            <li style={{ marginBottom: '0.5rem' }}>Damages resulting from errors, omissions, or inaccuracies in the Service</li>
            <li style={{ marginBottom: '0.5rem' }}>Damages resulting from unauthorized access to or use of the Service</li>
          </ul>
          <p style={{ marginBottom: '1rem' }}>
            In no event shall FixTools' total liability to you for all claims arising from or related to the Service exceed the amount you paid to FixTools in the twelve (12) months preceding the claim, or $100, whichever is greater.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            User Content and Data
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Your Responsibility:</strong> You are solely responsible for any content, data, or files you submit, upload, or process through the Service. You represent and warrant that you have all necessary rights, licenses, and permissions to use such content and that it does not violate any laws or third-party rights.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong>No Storage:</strong> Most FixTools utilities process data entirely in your browser, meaning your data never leaves your device. For tools that require server-side processing, we process your data in real-time and do not store it after processing completes. We do not claim ownership of any content you submit through the Service.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Backup:</strong> You are responsible for maintaining backups of your data. FixTools is not responsible for any loss or corruption of data resulting from your use of the Service.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Intellectual Property
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            <strong>FixTools Content:</strong> The Service, including its original content, features, functionality, design, logos, and trademarks, is owned by FixTools and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Your Content:</strong> You retain all rights to any content you submit, upload, or process through the Service. By using the Service, you grant FixTools a limited, non-exclusive, royalty-free license to process your content solely for the purpose of providing the Service to you.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Third-Party Content:</strong> The Service may contain content from third parties, including open-source libraries and APIs. Such content is subject to its respective licenses and terms.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Premium Features and Payments
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            FixTools offers both free and premium features. Premium features may include:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Processing larger files (above free tier limits)</li>
            <li style={{ marginBottom: '0.5rem' }}>Batch processing multiple files</li>
            <li style={{ marginBottom: '0.5rem' }}>Priority processing queues</li>
            <li style={{ marginBottom: '0.5rem' }}>Advanced features and tools</li>
          </ul>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Payment Terms:</strong> If you purchase premium features, you agree to pay all fees associated with your purchase. All fees are non-refundable unless required by law or as otherwise stated. Prices are subject to change at any time, but changes will not affect purchases already made.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Payment Processing:</strong> Payments are processed by third-party payment processors (e.g., Stripe). You agree to comply with their terms and conditions. FixTools is not responsible for any issues arising from payment processing.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Service Availability
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We strive to provide reliable and uninterrupted service, but we do not guarantee that the Service will be available at all times. The Service may be unavailable due to:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Scheduled maintenance or updates</li>
            <li style={{ marginBottom: '0.5rem' }}>Technical issues or server problems</li>
            <li style={{ marginBottom: '0.5rem' }}>Force majeure events (natural disasters, cyber attacks, etc.)</li>
            <li style={{ marginBottom: '0.5rem' }}>Changes to the Service</li>
          </ul>
          <p style={{ marginBottom: '1rem' }}>
            We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We are not liable for any loss or damage resulting from Service unavailability.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Indemnification
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            You agree to indemnify, defend, and hold harmless FixTools and its affiliates, officers, directors, employees, agents, and licensors from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including reasonable attorney's fees) arising from:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Your use of the Service</li>
            <li style={{ marginBottom: '0.5rem' }}>Your violation of these Terms</li>
            <li style={{ marginBottom: '0.5rem' }}>Your violation of any law or regulation</li>
            <li style={{ marginBottom: '0.5rem' }}>Your infringement of any third-party rights</li>
            <li style={{ marginBottom: '0.5rem' }}>Any content you submit, upload, or process through the Service</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Termination
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We reserve the right to terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including but not limited to:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Violation of these Terms</li>
            <li style={{ marginBottom: '0.5rem' }}>Fraudulent, abusive, or illegal activity</li>
            <li style={{ marginBottom: '0.5rem' }}>Request by law enforcement or government agencies</li>
            <li style={{ marginBottom: '0.5rem' }}>Extended periods of inactivity</li>
            <li style={{ marginBottom: '0.5rem' }}>Discontinuation or material modification of the Service</li>
          </ul>
          <p style={{ marginBottom: '1rem' }}>
            Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Governing Law and Dispute Resolution
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action. If for any reason a claim proceeds in court rather than in arbitration, you waive any right to a jury trial.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Changes to Terms
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We reserve the right to modify or replace these Terms at any time at our sole discretion. If we make material changes, we will notify you by posting the new Terms on this page and updating the "Last Updated" date.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Your continued use of FixTools after any changes to these Terms constitutes your acceptance of such changes. If you do not agree to the new Terms, you must stop using the Service.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            We encourage you to review these Terms periodically to stay informed about our terms and conditions.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Severability
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect and enforceable.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Entire Agreement
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and FixTools regarding the use of the Service and supersede all prior agreements and understandings, whether written or oral.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Contact Information
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Email:</strong> <a href="mailto:legal@fixtools.io" style={{ color: '#0066cc', textDecoration: 'underline' }}>legal@fixtools.io</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Website:</strong> <Link href="/" style={{ color: '#0066cc', textDecoration: 'underline' }}>fixtools.io</Link>
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '0', marginBottom: '1rem', fontWeight: '600' }}>
            Summary
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Key points of these Terms:</strong>
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>FixTools provides tools "as-is" without warranties</li>
            <li style={{ marginBottom: '0.5rem' }}>You are responsible for verifying outputs before production use</li>
            <li style={{ marginBottom: '0.5rem' }}>Do not submit unlawful, malicious, or sensitive personal data</li>
            <li style={{ marginBottom: '0.5rem' }}>You are responsible for complying with applicable laws</li>
            <li style={{ marginBottom: '0.5rem' }}>We may update these terms periodically</li>
            <li style={{ marginBottom: '0.5rem' }}>Continued use means you accept the current terms</li>
          </ul>
        </section>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            © {currentYear} FixTools. All rights reserved.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#0066cc', textDecoration: 'underline' }}>Home</Link>
            <Link href="/privacy" style={{ color: '#0066cc', textDecoration: 'underline' }}>Privacy Policy</Link>
            <Link href="/about" style={{ color: '#0066cc', textDecoration: 'underline' }}>About</Link>
            <Link href="/contact" style={{ color: '#0066cc', textDecoration: 'underline' }}>Contact</Link>
          </div>
        </div>
      </main>
    </>
  );
}

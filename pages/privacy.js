import CustomHead from '@/components/CustomHead';
import Link from 'next/link';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'https://fixtools.io';

export default function Privacy() {
  const canonicalUrl = `${siteHost}/privacy`;
  const currentYear = new Date().getFullYear();

  return (
    <>
      <CustomHead
        title="Privacy Policy"
        metaDescription="FixTools Privacy Policy - Learn how we protect your data and privacy. We process most tools entirely in your browser. No data storage, no tracking, complete privacy for all users."
        ogImageUrl="/programming_tools.jpg"
        ogImageAlt="FixTools privacy policy"
        ogUrl={canonicalUrl}
        keywords="privacy policy, data protection, user privacy, browser-based tools, no data storage, GDPR compliance"
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
          Privacy Policy
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.1rem' }}>
          <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Introduction
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            At FixTools, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. By accessing or using FixTools, you agree to the collection and use of information in accordance with this policy.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            FixTools provides a collection of free online tools for developers, creators, and marketers. Our primary commitment is to process your data entirely in your browser whenever possible, ensuring maximum privacy and security. We believe that your data belongs to you, and we strive to minimize data collection and processing.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Information We Collect
          </h2>
          
          <h3 style={{ fontSize: '1.4rem', marginTop: '1.5rem', marginBottom: '0.75rem', fontWeight: '600' }}>
            Information You Provide
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            Most FixTools utilities run entirely in your browser, meaning your data never leaves your device. However, for certain tools that require server-side processing (such as AI-powered features or live exchange rates), we may temporarily process your inputs to fulfill your request. This data is transmitted only to complete the requested operation and is not stored for reuse.
          </p>

          <h3 style={{ fontSize: '1.4rem', marginTop: '1.5rem', marginBottom: '0.75rem', fontWeight: '600' }}>
            Automatically Collected Information
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            We may collect basic analytics information to improve our services, including:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Page views and feature usage statistics</li>
            <li style={{ marginBottom: '0.5rem' }}>Browser type and version</li>
            <li style={{ marginBottom: '0.5rem' }}>Device type and operating system</li>
            <li style={{ marginBottom: '0.5rem' }}>IP address (anonymized when possible)</li>
            <li style={{ marginBottom: '0.5rem' }}>Referral sources and search terms</li>
          </ul>
          <p style={{ marginBottom: '1rem' }}>
            This information helps us understand how users interact with our tools, identify popular features, and improve the overall user experience. We do not use this data to identify individual users or create detailed user profiles.
          </p>

          <h3 style={{ fontSize: '1.4rem', marginTop: '1.5rem', marginBottom: '0.75rem', fontWeight: '600' }}>
            Cookies and Tracking Technologies
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            We may use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us remember your preferences and improve site functionality. We use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device for a set period).
          </p>
          <p style={{ marginBottom: '1rem' }}>
            You can control cookie preferences through your browser settings. However, disabling cookies may limit some functionality of our website. We do not use cookies for advertising purposes or to track you across other websites.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            How We Use Your Information
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We use the information we collect for the following purposes:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Service Delivery:</strong> To provide, maintain, and improve our tools and services
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Analytics:</strong> To analyze usage patterns and improve user experience
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Security:</strong> To detect and prevent fraud, abuse, and security threats
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Communication:</strong> To respond to your inquiries and provide customer support
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes
            </li>
          </ul>
          <p style={{ marginBottom: '1rem' }}>
            We do not sell, rent, or trade your personal information to third parties. We do not use your data for advertising purposes or share it with marketing companies.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Data Processing and Storage
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Client-Side Processing:</strong> The majority of FixTools utilities process your data entirely in your browser using JavaScript. This means your files, text, code, and other inputs never leave your device. Examples include JSON formatters, HTML validators, CSS generators, image converters, and most text manipulation tools.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Server-Side Processing:</strong> Some tools require server-side processing, such as:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>AI-powered features that require external APIs</li>
            <li style={{ marginBottom: '0.5rem' }}>Live data feeds (e.g., currency exchange rates)</li>
            <li style={{ marginBottom: '0.5rem' }}>Complex file conversions that require server resources</li>
            <li style={{ marginBottom: '0.5rem' }}>PDF processing for large files or batch operations</li>
          </ul>
          <p style={{ marginBottom: '1rem' }}>
            When server-side processing is required, we transmit only the minimum data necessary to fulfill your request. This data is processed in real-time and is not stored on our servers after the operation completes. We implement industry-standard security measures to protect data in transit.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Data Retention:</strong> We do not retain your personal data or file contents after processing is complete. Analytics data is aggregated and anonymized, with no personally identifiable information retained.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Third-Party Services
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We may use third-party services to support our operations, including:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Hosting Providers:</strong> Our website is hosted on secure cloud infrastructure
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Analytics Services:</strong> We may use analytics tools to understand website usage (data is anonymized)
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Payment Processors:</strong> For premium features, we use secure payment processors (Stripe) that handle payment data according to their own privacy policies
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>CDN Services:</strong> Content delivery networks to ensure fast loading times
            </li>
          </ul>
          <p style={{ marginBottom: '1rem' }}>
            These third-party services have their own privacy policies governing data collection and use. We encourage you to review their policies. We only share data with third parties when necessary to provide our services, and we ensure they maintain appropriate security standards.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Data Security
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Encryption of data in transit using HTTPS/TLS</li>
            <li style={{ marginBottom: '0.5rem' }}>Secure server infrastructure with regular security updates</li>
            <li style={{ marginBottom: '0.5rem' }}>Limited access to personal data on a need-to-know basis</li>
            <li style={{ marginBottom: '0.5rem' }}>Regular security audits and vulnerability assessments</li>
            <li style={{ marginBottom: '0.5rem' }}>Client-side processing to minimize data exposure</li>
          </ul>
          <p style={{ marginBottom: '1rem' }}>
            However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Your Rights and Choices
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Access:</strong> Request access to personal information we hold about you
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Correction:</strong> Request correction of inaccurate or incomplete information
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Deletion:</strong> Request deletion of your personal information
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Objection:</strong> Object to processing of your personal information
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Data Portability:</strong> Request transfer of your data to another service
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Withdraw Consent:</strong> Withdraw consent for data processing where applicable
            </li>
          </ul>
          <p style={{ marginBottom: '1rem' }}>
            To exercise these rights, please contact us at <a href="mailto:privacy@fixtools.io" style={{ color: '#0066cc', textDecoration: 'underline' }}>privacy@fixtools.io</a>. We will respond to your request within a reasonable timeframe and in accordance with applicable laws.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            You can also control your privacy preferences through your browser settings, including cookie preferences and Do Not Track signals.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Children's Privacy
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            FixTools is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            International Data Transfers
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            FixTools is operated from the United States. If you access our services from outside the United States, your information may be transferred to, stored, and processed in the United States. By using our services, you consent to the transfer of your information to the United States.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            If you are located in the European Economic Area (EEA), United Kingdom, or other regions with data protection laws, we ensure that appropriate safeguards are in place to protect your information in accordance with applicable data protection regulations, including the General Data Protection Regulation (GDPR).
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Changes to This Privacy Policy
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information. Your continued use of FixTools after any changes to this Privacy Policy constitutes your acceptance of such changes.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
            Contact Us
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Email:</strong> <a href="mailto:privacy@fixtools.io" style={{ color: '#0066cc', textDecoration: 'underline' }}>privacy@fixtools.io</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Website:</strong> <Link href="/" style={{ color: '#0066cc', textDecoration: 'underline' }}>fixtools.io</Link>
            </li>
          </ul>
          <p style={{ marginBottom: '1rem' }}>
            We will make every effort to respond to your inquiry promptly and address any concerns you may have.
          </p>
        </section>

        <section style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '1.8rem', marginTop: '0', marginBottom: '1rem', fontWeight: '600' }}>
            Summary
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            <strong>FixTools is committed to your privacy:</strong>
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Most tools process data entirely in your browser - your data never leaves your device</li>
            <li style={{ marginBottom: '0.5rem' }}>We do not sell, rent, or trade your personal information</li>
            <li style={{ marginBottom: '0.5rem' }}>Server-side processing is minimal and data is not stored after processing</li>
            <li style={{ marginBottom: '0.5rem' }}>We collect only basic analytics to improve our services</li>
            <li style={{ marginBottom: '0.5rem' }}>Your data is protected with industry-standard security measures</li>
            <li style={{ marginBottom: '0.5rem' }}>You have rights regarding your personal information</li>
          </ul>
          <p style={{ marginBottom: '0' }}>
            For questions or concerns, contact us at <a href="mailto:privacy@fixtools.io" style={{ color: '#0066cc', textDecoration: 'underline' }}>privacy@fixtools.io</a>.
          </p>
        </section>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            © {currentYear} FixTools. All rights reserved.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#0066cc', textDecoration: 'underline' }}>Home</Link>
            <Link href="/terms" style={{ color: '#0066cc', textDecoration: 'underline' }}>Terms of Service</Link>
            <Link href="/about" style={{ color: '#0066cc', textDecoration: 'underline' }}>About</Link>
            <Link href="/contact" style={{ color: '#0066cc', textDecoration: 'underline' }}>Contact</Link>
          </div>
        </div>
      </main>
    </>
  );
}

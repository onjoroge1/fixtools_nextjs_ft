import CustomHead from '@/components/CustomHead';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

export default function Privacy() {
  const canonicalUrl = `${siteHost}/privacy`;

  return (
    <>
      <CustomHead
        title="Privacy Policy"
        metaDescription="Privacy policy for Fixtools web utilities."
        ogImageUrl="/programming_tools.jpg"
        ogImageAlt="Fixtools privacy policy"
        ogUrl={canonicalUrl}
      />
      <main
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '3rem 1rem',
          lineHeight: 1.6,
        }}
      >
        <h1>Privacy Policy</h1>
        <p>
          Fixtools aims to keep your data private. Most tools run entirely in
          your browser. When a backend is used (for example, AI prompts or live
          exchange rates), inputs are transmitted only to fulfill your request
          and are not stored for reuse.
        </p>
        <p>
          We may collect basic analytics (page views, feature usage) to improve
          the product. We do not sell personal data.
        </p>
        <p>
          If you have questions about privacy or data handling, contact us at{' '}
          <a href="mailto:privacy@fixtools.app">privacy@fixtools.app</a>.
        </p>
      </main>
    </>
  );
}


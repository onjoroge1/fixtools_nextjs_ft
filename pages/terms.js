import CustomHead from '@/components/CustomHead';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

export default function Terms() {
  const canonicalUrl = `${siteHost}/terms`;

  return (
    <>
      <CustomHead
        title="Terms of Use"
        metaDescription="Terms of use for Fixtools web utilities."
        ogImageUrl="/programming_tools.jpg"
        ogImageAlt="Fixtools terms of use"
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
        <h1>Terms of Use</h1>
        <p>
          Fixtools provides web utilities as-is, without warranties. Use the
          tools at your own risk, and verify outputs before production use.
        </p>
        <p>
          Do not submit unlawful, malicious, or sensitive personal data. You are
          responsible for complying with applicable laws in your jurisdiction.
        </p>
        <p>
          We may update these terms periodically. Continued use of Fixtools
          means you accept the current terms.
        </p>
      </main>
    </>
  );
}

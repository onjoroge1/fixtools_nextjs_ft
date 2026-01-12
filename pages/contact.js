import CustomHead from '@/components/CustomHead';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

export default function Contact() {
  const canonicalUrl = `${siteHost}/contact`;

  return (
    <>
      <CustomHead
        title="Contact"
        metaDescription="Contact Fixtools with feedback, bugs, or feature requests."
        ogImageUrl="/programming_tools.jpg"
        ogImageAlt="Contact Fixtools"
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
        <h1>Contact</h1>
        <p>
          Share feedback, bug reports, or feature requests. We aim to respond
          within 2–3 business days.
        </p>
        <ul>
          <li>
            Email: <a href="mailto:hello@fixtools.app">hello@fixtools.app</a>
          </li>
          <li>
            Twitter/X: <a href="https://twitter.com">@Fixtools</a>
          </li>
        </ul>
      </main>
    </>
  );
}



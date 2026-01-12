import CustomHead from '@/components/CustomHead';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

export default function About() {
  const canonicalUrl = `${siteHost}/about`;

  return (
    <>
      <CustomHead
        title="About Fixtools"
        metaDescription="Learn about Fixtools—fast, no-signup web tools for developers and marketers."
        ogImageUrl="/programming_tools.jpg"
        ogImageAlt="Fixtools about page"
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
        <h1>About Fixtools</h1>
        <p>
          Fixtools is a collection of fast, no-signup tools for formatting,
          converting, and generating everyday code and content. We keep the
          experience lightweight so you can fix tasks without context switching.
        </p>
        <p>
          Most tools run entirely in your browser to keep your data private.
          When a backend is required (for example, live currency rates or AI
          prompts), we call minimal endpoints and avoid storing user data.
        </p>
        <p>
          We add new helpers regularly. If you have feedback or requests, reach
          out via the contact page.
        </p>
      </main>
    </>
  );
}



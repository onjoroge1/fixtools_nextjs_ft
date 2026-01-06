import Link from 'next/link';
import { useRouter } from 'next/router';

import CustomHead from '@/components/CustomHead';
import Data from '@/dbTools';

const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

const categoryMap = {
  'ai-tools': 'AI Tools',
  'conversion-tools': 'Conversion Tools',
  // 'json-tools' is handled by static page at /categories/json-tools.jsx
  'html-tools': 'HTML Tools',
  'css-tools': 'CSS Tools',
  'seo-tools': 'SEO Tools',
};

const categoryDescriptions = {
  'AI Tools':
    'Chat, summarize, classify, and generate content with lightweight AI helpers.',
  'Conversion Tools':
    'Convert currency, units, and time zones quickly in your browser.',
  'JSON Tools':
    'Format, validate, and transform JSON payloads fast and safely.',
  'HTML Tools': 'Generate and format common HTML snippets and clean up markup.',
  'CSS Tools': 'Generate gradients and CSS snippets without memorizing syntax.',
  'SEO Tools':
    'Create sitemaps and inspect IP/location details for your domains.',
};

export default function CategoryPage({ title, tools, description }) {
  const router = useRouter();
  const canonicalUrl = `${siteHost}${router.asPath}`;

  return (
    <>
      <CustomHead
        title={`${title}`}
        metaDescription={description}
        ogImageUrl="/programming_tools.jpg"
        ogImageAlt={`${title} at Fixtools`}
        ogUrl={canonicalUrl}
      />
      <main
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '3rem 1rem',
          lineHeight: 1.6,
        }}
      >
        <h1 style={{ marginBottom: '0.5rem' }}>{title}</h1>
        <p style={{ marginTop: 0, maxWidth: '760px' }}>{description}</p>

        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Tools in this category</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
            }}
          >
            {tools.map((tool) => (
              <Link
                key={tool.link}
                href={tool.link}
                style={{
                  display: 'block',
                  padding: '1rem 1.1rem',
                  border: '1px solid #e6e6e6',
                  borderRadius: '10px',
                  background: '#fafafa',
                  textDecoration: 'none',
                  color: 'inherit',
                  minHeight: '120px',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>
                  {tool.title}
                </div>
                <div style={{ color: '#555', fontSize: '0.95rem' }}>
                  {tool.desc}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>How to use these tools</h2>
          <ol>
            <li>Pick a tool from the list above based on your task.</li>
            <li>
              Follow the on-page instructions (input, click, copy the result).
            </li>
            <li>
              Use related links on each tool page to move to adjacent tasks.
            </li>
          </ol>
        </section>
      </main>
    </>
  );
}

export function getStaticPaths() {
  const paths = Object.keys(categoryMap).map((slug) => ({
    params: { category: slug },
  }));

  return { paths, fallback: false };
}

export function getStaticProps({ params }) {
  const slug = params.category;
  const categoryName = categoryMap[slug];

  const tools = (Data || []).filter((tool) => tool.category === categoryName);

  return {
    props: {
      title: categoryName,
      tools,
      description: categoryDescriptions[categoryName] || '',
    },
  };
}


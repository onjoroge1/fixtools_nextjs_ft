const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

const generateRobots = () => `User-agent: *
Allow: /
Sitemap: ${siteHost}/sitemap.xml
`;

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/plain');
  res.write(generateRobots());
  res.end();

  return {
    props: {},
  };
}

export default function Robots() {
  return null;
}


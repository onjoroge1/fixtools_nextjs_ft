export default function LegacyCssFormatterRedirect() {
  return null;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: '/css-tool/css-formatter',
      permanent: true,
    },
  };
}

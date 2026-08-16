export default function LegacyJsonFormatterRedirect() {
  return null;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: '/json/json-formatter',
      permanent: true,
    },
  };
}

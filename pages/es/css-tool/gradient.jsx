export default function LegacyGradientRedirect() {
  return null;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: '/css-tool/gradient',
      permanent: true,
    },
  };
}

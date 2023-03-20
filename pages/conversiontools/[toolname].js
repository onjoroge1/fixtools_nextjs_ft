import { useRouter } from 'next/router';
import conversionToolsDb from '@/dbTools/conversionToolsDb';

import ConversionTool from '@/components/conversionToolComponent/ConversionTool';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function ConversionToolComp({ currentPage }) {
  console.log({ currentPage });

  return (
    <>
      <HeaderNav />
      <ConversionTool currentPage={currentPage} />
      <Footer />
    </>
  );
}

export function getStaticPaths() {
  const path = conversionToolsDb.map((tool) => {
    return {
      params: { toolname: tool.type },
    };
  });

  return {
    paths: path,
    fallback: false,
  };
}

export function getStaticProps(ctx) {
  const currentPageName = ctx.params.toolname;
  return {
    props: {
      currentPage: conversionToolsDb.find(
        (tool) => tool.type === currentPageName
      ),
    },
  };
}

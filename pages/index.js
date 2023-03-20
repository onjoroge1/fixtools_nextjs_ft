import Header from '@/components/Header';
import CustomHead from '@/components/CustomHead';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

import { useRouter } from 'next/router';

export default function Home() {
  return (
    <>
      <Header />
      <Footer />
    </>
  );
}

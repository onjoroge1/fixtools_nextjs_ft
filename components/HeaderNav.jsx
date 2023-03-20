import { useState } from 'react';
import Link from 'next/link';

export default function HeaderNav() {
  const [closetoggle, setclosetoggle] = useState(true);

  const toggerHandler = () => {
    setclosetoggle(!closetoggle);
  };
  return (
    <div className='header'>
      <div className='header-logo'>
        <Link href='/'>
          <img
            src='/fixtools-logos/fixtools-logos_black.svg'
            alt='logo'
          />
        </Link>
      </div>
    </div>
  );
}

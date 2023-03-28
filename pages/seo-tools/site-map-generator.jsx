import React, { useState } from 'react';
import axios from 'axios';

import HeaderNav from '@/components/HeaderNav';

import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';
import { GetCurrentPageContent } from '../utils';
import seoTools from '@/dbTools/seoTools';

import Footer from '@/components/Footer/Footer';

const SitemapGenerator = () => {
  const [url, setUrl] = useState('');
  const [sitemap, setSitemap] = useState(null);

  const path = useRouter().pathname;
  const route = useRouter();
  const { title, desc, image } = GetCurrentPageContent(path, seoTools);

  const handleChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // make a GET request to the specified URL to retrieve the sitemap
    axios
      .get(url)
      .then((response) => {
        setSitemap(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <CustomHead
        title={title}
        ogUrl={process.env.NEXT_PUBLIC_HOST + route.asPath}
        metaDescription={desc}
        ogImageUrl='/programming_tools.jpg'
        ogImageAlt='Fix tools og image'
      />
      <HeaderNav />
      <form onSubmit={handleSubmit}>
        <label>
          URL:
          <input
            type='text'
            value={url}
            onChange={handleChange}
          />
        </label>
        <button type='submit'>Submit</button>
        {sitemap && <pre>{JSON.stringify(sitemap, null, 2)}</pre>}
      </form>
    </>
  );
};

export default SitemapGenerator;

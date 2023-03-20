import React, { useState } from 'react';
import { useEffect } from 'react';

import HtmlTool from '@/dbTools/HtmlTool';

import { GetCurrentPageContent } from '../../../utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function HtmlTelInput() {
  const [value, setValue] = useState('Telephone..');
  const [required, setrequired] = useState('');
  const [size, setSize] = useState('');

  //
  const route = useRouter();
  console.log(route);
  const path = route.pathname;
  const { title, desc, image } = GetCurrentPageContent(path, HtmlTool);
  console.log({ title });
  //

  let tag = '';
  tag += `   <input type="${'tel'}" size="${size}" ${required} placeholder="${value}"   />`;

  return (
    <>
      <CustomHead
        title={title}
        ogUrl={process.env.NEXT_PUBLIC_HOST + route.asPath}
        metaDescription={desc}
        ogImageUrl='/programming_tools.jpg'
        ogImageAlt='Fix tools og image'
      />
      <div className='detail-hero'>
        <HeaderNav />
        <div className='detail-hero-content'>
          <div className='detail-hero-content-heading'>
            <h1>HTML Telephone Input Generator</h1>
          </div>
          <div className='detail-hero-content-des'>
            <p>
              Generate HTML Telephone Input with our generator tool. Preview the
              result and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div className='screen'>
        <div className='screen-editor'>
          <h1>Options</h1>

          <div className='screen-editor-color'>
            <label>Placeholder</label>
            <input
              type={'email'}
              placeholder={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Size</label>
            <input
              type={'number'}
              placeholder={'Enter number'}
              onChange={(e) => setSize(e.target.value)}
            />
          </div>

          <div
            className='screen-editor-color checkbox'
            style={{ flexDirection: 'row' }}
          >
            <label style={{ 'align-items': 'flex-end' }}>
              <input
                type={'checkbox'}
                onChange={(e) =>
                  setrequired(e.target.checked ? 'required' : '')
                }
                style={{ height: '25px', width: '25px' }}
              />
              Required
            </label>
          </div>
        </div>
        <div className='screen-preview'>
          <h1>Preview</h1>
          <div className='screen-preview-box'>
            <div
              className='screen-preview-box-sample'
              style={{ overflow: 'hidden' }}
            >
              <div>
                <input
                  type={'tel'}
                  size={size}
                  required={required}
                  placeholder={value}
                />
              </div>
            </div>
          </div>
          <h1>Code</h1>
          <div className='screen-preview-code'>
            <code> {tag} </code>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

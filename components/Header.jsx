import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import CustomHead from './CustomHead';
import HeaderNav from './HeaderNav';
// import './header.css';
import data from '../dbTools/index';
import { useEffect } from 'react';

export default function Header() {
  const [cards, setCards] = useState(data);
  const [filteredCard, setfilteredCard] = useState(data);
  const [activeTab, setactiveTab] = useState('All');

  console.log('----==>> ', data);
  // console.log({ filteredCard });

  if (!cards) {
    return <h1>Loading</h1>;
  }

  const filterItems = (cate) => {
    console.log(cate);
    setactiveTab(cate);
    if (cate === 'All') {
      setfilteredCard(cards);
    } else {
      const updateCards = cards.filter(
        (currentEle) => currentEle.category === cate
      );
      setfilteredCard(updateCards);
    }
  };

  return (
    <>
      <div className='hero'>
        <HeaderNav />
        <div className='hero-content'>
          <div className='hero-content-heading'>
            <h1>Tools To Fix File Problems</h1>
          </div>
          <div className='hero-content-des'>
            <p>
              Find below a collection of tools to help with any of your file
              needs.
            </p>
          </div>
          <div className='hero-content-nav'>
            <Button
              className={
                activeTab === 'All'
                  ? 'hero-content-nav-btn homebtn'
                  : 'hero-content-nav-btn'
              }
              onClick={() => filterItems('All')}
            >
              All
            </Button>
            {/* <Button
              className={
                activeTab == "PDF Tools"
                  ? "hero-content-nav-dis-btn"
                  : "hero-content-nav-dis-btn"
              }
              onClick={() => filterItems("PDF Tools")}>
              PDF Tools
            </Button> */}
            <Button
              className={
                activeTab === 'CSS Tools'
                  ? 'hero-content-nav-btn homebtn '
                  : 'hero-content-nav-btn'
              }
              onClick={() => filterItems('CSS Tools')}
            >
              CSS Tools
            </Button>
            <Button
              className={
                activeTab === 'JSON Tools'
                  ? 'hero-content-nav-btn homebtn '
                  : 'hero-content-nav-btn'
              }
              onClick={() => filterItems('JSON Tools')}
            >
              JSON Tools
            </Button>
            <Button
              className={
                activeTab === 'HTML Tools'
                  ? 'hero-content-nav-btn homebtn '
                  : 'hero-content-nav-btn'
              }
              onClick={() => filterItems('HTML Tools')}
            >
              HTML Tools
            </Button>
            <Button
              className={
                activeTab === 'AI Tools'
                  ? 'hero-content-nav-btn homebtn '
                  : 'hero-content-nav-btn'
              }
              onClick={() => filterItems('AI Tools')}
            >
              AI Tools
            </Button>
            <Button
              className={
                activeTab == 'Conversion Tools'
                  ? 'hero-content-nav-btn homebtn '
                  : 'hero-content-nav-btn'
              }
              onClick={() => filterItems('Conversion Tools')}
            >
              Conversion Tools
            </Button>
            <Button
              className={
                activeTab == 'Text Tools'
                  ? 'hero-content-nav-btn homebtn '
                  : 'hero-content-nav-btn'
              }
              onClick={() => filterItems('Text Tools')}
            >
              Text Tools
            </Button>
            <Button
              className={
                activeTab == 'SEO Tools'
                  ? 'hero-content-nav-btn homebtn '
                  : 'hero-content-nav-btn'
              }
              onClick={() => filterItems('SEO Tools')}
            >
              SEO Tools
            </Button>
          </div>
        </div>
      </div>
      <div className='main-content'>
        {filteredCard.map((ele) => {
          const { id, title, image, desc, category, categorysty, link } = ele;
          return (
            <Link href={link}>
              <div
                className={`main-content-card ${categorysty}`}
                key={id}
              >
                {/* <img
                  src={image}
                  alt={image}
                /> */}
                <img
                  src={image}
                  alt={image}
                />

                <h2 className='main-content-card-heading'>{title}</h2>
                <p className='card-des'>{desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

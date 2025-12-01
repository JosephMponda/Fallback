import React from 'react';
import Hero from '../components/home/Hero';
import WhoWeAre from '../components/home/WhoWeAre';
import WhatWeDo from '../components/home/WhatWeDo';
import LatestNews from '../components/home/LatestNews';

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <WhoWeAre />
      <WhatWeDo />
      <LatestNews />
    </div>
  );
};

export default Home;

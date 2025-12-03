import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroData = {
    headline: "Proud to be a part of every home",
    subheading: "Bringing hundreds of incredible brands to our customers",
    ctaText: "Read More",
    ctaLink: "/about",
    backgroundImage: "url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: heroData.backgroundImage }}
    >
      <div className="absolute inset-0 bg-brand-blue opacity-80"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
          {heroData.headline}
        </h1>
        <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto">
          {heroData.subheading}
        </p>
        <div className="flex justify-center">
          <Link to={heroData.ctaLink} className="bg-brand-gold text-white px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all text-lg shadow-lg">
            {heroData.ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;

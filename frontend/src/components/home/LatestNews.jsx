import React from 'react';
import { Link } from 'react-router-dom';

const LatestNews = () => {
  const newsItems = [
    {
      date: '22 May 2025',
      title: 'Alghanim Industries Brings Starlink\'s Groundbreaking Satellite Internet to Global Markets',
      image: 'https://images.unsplash.com/photo-1664151799295-5fa45332612a?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%_3D%3D'
    },
    {
      date: '20 February 2025',
      title: 'Alghanim Industries Unveils "Ta’amal" – A Tribute to Kuwait’s National Celebrations',
      image: 'https://images.unsplash.com/photo-1664151799295-5fa45332612a?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%_3D%3D'
    },
    {
      date: '18 December 2024',
      title: 'Alghanim Industries and BYD Unveil Landmark Showroom in Kuwait',
      image: 'https://images.unsplash.com/photo-1664151799295-5fa45332612a?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%_3D%3D'
    },
  ];

  return (
    <section className="bg-brand-gray-light py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-gray-dark">LATEST NEWS</h2>
          <p className="text-xl text-brand-gray mt-4">Get in touch with our latest news and events</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden group">
              <div className="overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <p className="text-brand-gray text-sm mb-2">{item.date}</p>
                <h3 className="text-lg font-semibold text-brand-gray-dark mb-4 h-24">{item.title}</h3>
                <Link to="/news" className="text-brand-blue hover:underline font-semibold">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;

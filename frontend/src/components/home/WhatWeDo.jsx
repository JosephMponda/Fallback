import React from 'react';
import { Link } from 'react-router-dom';

const WhatWeDo = () => {
  const services = [
    { title: 'Retail & Distribution', image: 'https://images.unsplash.com/photo-1556740738-b6a63e2775d2?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { title: 'Food & Beverage', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1887&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { title: 'Automotive', image: 'https://images.unsplash.com/photo-1542282088-fe84a455e035?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { title: 'Industrial', image: 'https://images.unsplash.com/photo-1581092921462-68209e18b1ea?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ];

  return (
    <section className="bg-white py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-gray-dark">WHAT WE DO</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
              <img src={service.image} alt={service.title} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-brand-gray-dark mb-2">{service.title}</h3>
                <Link to="/services" className="text-brand-blue hover:underline font-semibold">
                  Learn more
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;

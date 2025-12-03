import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const links = {
    'Corporate Profile': [
      { text: 'Who we are', path: '/about' },
      { text: 'Vision, Mission & Values', path: '/about' },
      { text: 'Executive Team', path: '/about' },
    ],
    'Other Links': [
      { text: 'Giving Forward', path: '/' },
      { text: 'News', path: '/' },
      { text: 'Careers', path: '/' },
      { text: 'Contact Us', path: '/contact' },
    ]
  };

  return (
    <footer className="bg-brand-gray-dark text-white pt-20 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {Object.entries(links).map(([title, list]) => (
            <div key={title}>
              <h3 className="font-bold text-lg mb-4 text-white">{title}</h3>
              <ul>
                {list.map(link => (
                  <li key={link.text} className="mb-2">
                    <Link to={link.path} className="text-brand-gray hover:text-white transition-colors">{link.text}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-brand-gray flex flex-col md:flex-row justify-between items-center">
          <p className="text-brand-gray">© 2025 Everest Printing Press</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/" className="text-brand-gray hover:text-white">Terms & Conditions</Link>
            <Link to="/" className="text-brand-gray hover:text-white">Website Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

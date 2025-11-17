import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const services = [
    {
      icon: '🖨️',
      title: 'Offset Printing',
      description: 'High-quality offset printing for books, magazines, brochures, and more. Perfect for large volume orders.',
      features: ['High Volume', 'Cost Effective', 'Superior Quality']
    },
    {
      icon: '🎨',
      title: 'Screen Printing',
      description: 'Vibrant screen printing on t-shirts, banners, and promotional materials. Durable and eye-catching.',
      features: ['Vibrant Colors', 'Durable', 'Custom Designs']
    },
    {
      icon: '🏳️',
      title: 'Banner Printing',
      description: 'Large format banner printing for events, advertising, and displays. Weather-resistant materials.',
      features: ['Large Format', 'Weather Resistant', 'Quick Turnaround']
    },
    {
      icon: '🎥',
      title: 'Video Production',
      description: 'Professional video production services for commercials, corporate videos, and event coverage.',
      features: ['HD Quality', 'Professional Editing', 'Fast Delivery']
    }
  ]

  const stats = [
    { number: '500+', label: 'Happy Clients' },
    { number: '10+', label: 'Years Experience' },
    { number: '2000+', label: 'Projects Completed' },
    { number: '24/7', label: 'Support Available' }
  ]

  const whyChooseUs = [
    { title: 'Quality Guarantee', description: 'State-of-the-art equipment and premium materials', icon: '✓' },
    { title: 'Fast Turnaround', description: 'Express services without compromising quality', icon: '⚡' },
    { title: 'Competitive Pricing', description: 'Professional results at budget-friendly prices', icon: '💰' },
    { title: 'Expert Team', description: 'Experienced professionals guide every project', icon: '👥' }
  ]

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-700 to-primary-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Print Your Vision<br/>
            <span className="text-accent-500">Into Reality</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto">
            Blantyre's premier printing press offering offset printing, screen printing, banner production, and professional video services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/order" className="btn-primary text-lg">
              Get A Quote
            </Link>
            <Link to="/services" className="btn-secondary bg-white/10 border-white text-white hover:bg-white/20 text-lg">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive printing and media production solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card group cursor-pointer">
                <div className="p-8">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 text-center">
                  <Link to="/order" className="text-white font-semibold hover:underline">
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600">We deliver excellence in every project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8">Get in touch with us today for a free consultation and quote</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/order" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all text-lg shadow-lg">
              Request Quote
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all text-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

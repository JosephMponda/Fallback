import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const [iconError, setIconError] = useState({})
  const services = [
    {
      title: 'Offset Printing',
      description: 'High-quality offset printing for books, magazines, brochures, and more. Perfect for large volume orders.',
      features: ['High Volume', 'Cost Effective', 'Superior Quality'],
      img: '/assets/Speedmaster.webp'
    },
    {
      title: 'Screen Printing',
      description: 'Vibrant screen printing on t-shirts, banners, and promotional materials. Durable and eye-catching.',
      features: ['Vibrant Colors', 'Durable', 'Custom Designs'],
      img: '/assets/Screen-Printing.webp'
    },
    {
      title: 'Banner Printing',
      description: 'Large format banner printing for events, advertising, and displays. Weather-resistant materials.',
      features: ['Large Format', 'Weather Resistant', 'Quick Turnaround'],
      img: '/assets/Large-Format-Print.webp'
    },
    {
      title: 'Video Production',
      description: 'Professional video production services for commercials, corporate videos, and event coverage.',
      features: ['HD Quality', 'Professional Editing', 'Fast Delivery'],
      img: '/assets/Video-Production.webp'
    }
  ]

  const stats = [
    { number: '500+', label: 'Happy Clients' },
    { number: '10+', label: 'Years Experience' },
    { number: '2000+', label: 'Projects Completed' },
    { number: '24/7', label: 'Support Available' }
  ]

  const whyChooseUs = [
    {
      title: 'Quality Guarantee',
      description: 'State-of-the-art equipment and premium materials',
      icon: '✓',
      iconUrl: 'https://images.unsplash.com/photo-1638262052640-82e94d64664a?auto=format&fit=crop&w=200&q=80'
    },
    {
      title: 'Fast Turnaround',
      description: 'Express services without compromising quality',
      icon: '⚡',
      iconUrl: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&w=200&q=80'
    },
    {
      title: 'Competitive Pricing',
      description: 'Professional results at budget-friendly prices',
      icon: '💰',
      iconUrl: 'https://plus.unsplash.com/premium_photo-1718737640908-b6107649c9f0?auto=format&fit=crop&w=200&q=80'
    },
    {
      title: 'Expert Team',
      description: 'Experienced professionals guide every project',
      icon: '👥',
      iconUrl: 'https://plus.unsplash.com/premium_photo-1663047573369-e65d9b9e8387?auto=format&fit=crop&w=200&q=80'
    }
  ]

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center hero-bg bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Print Your Vision<br/>
            <span className="text-accent-500">Into Reality</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto">
            Blantyre's premier printing press offering offset printing, screen printing, banner production, and professional video services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/order" className="btn-primary text-lg">Get A Quote</Link>
            <Link to="/services" className="btn-secondary bg-white/10 border-white text-white hover:bg-white/20 text-lg">Explore Services</Link>
          </div>
        </div>
      </section>

      <section className="relative py-16 stats-bg bg-cover bg-center">
        <div className="absolute inset-0 bg-black/55"></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80 font-medium">{stat.label}</div>
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
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg flex flex-col overflow-hidden">
                <div className="w-full h-40 relative bg-gray-100 overflow-hidden">
                  <img src={service.img} alt={service.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute left-4 bottom-4 text-white">
                    <h3 className="text-xl font-bold">{service.title}</h3>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
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

                <Link
                  to="/order"
                  className="block w-full p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-center text-white font-semibold hover:underline"
                >
                  Learn More →
                </Link>
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
            {whyChooseUs.map((item, index) => {
              const showFallback = item.iconUrl && iconError[index]
              return (
                <div key={index} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden relative">
                    {item.iconUrl && !iconError[index] ? (
                      <img
                        src={item.iconUrl}
                        alt={`${item.title} icon`}
                        className="w-full h-full object-cover"
                        onError={() => setIconError(prev => ({ ...prev, [index]: true }))}
                      />
                    ) : (
                      <span className="text-3xl">{item.icon}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative section-padding cta-bg bg-cover bg-center text-white">
        <div className="absolute inset-0 bg-black/65"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8">Get in touch with us today for a free consultation and quote</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/order" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all text-lg">
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

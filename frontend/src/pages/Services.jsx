import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { servicesAPI } from '../api/services'

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fallback services if API fails
  const fallbackServices = [
    {
      title: 'Offset Printing',
      icon: '🖨️',
      description: 'Professional offset printing services for all your commercial printing needs.',
      items: ['Business Cards', 'Brochures & Flyers', 'Magazines & Catalogs', 'Books & Manuals', 'Letterheads', 'Envelopes', 'Posters', 'Annual Reports']
    },
    {
      title: 'Screen Printing',
      icon: '🎨',
      description: 'High-quality screen printing for apparel, promotional items, and custom merchandise.',
      items: ['T-Shirts & Apparel', 'Promotional Items', 'Tote Bags', 'Caps & Hats', 'Banners', 'Stickers', 'Custom Merchandise', 'Event Materials']
    },
    {
      title: 'Large Format Printing',
      icon: '🏳️',
      description: 'Eye-catching large format printing for advertising, events, and displays.',
      items: ['Banners', 'Billboards', 'Vehicle Wraps', 'Window Graphics', 'Floor Graphics', 'Trade Show Displays', 'Point of Sale', 'Backdrops']
    },
    {
      title: 'Video Production',
      icon: '🎥',
      description: 'Complete video production services from concept to final edit.',
      items: ['Corporate Videos', 'Commercials', 'Event Coverage', 'Product Videos', 'Training Videos', 'Documentaries', 'Social Media Content', 'Video Editing']
    },
    {
      title: 'Design Services',
      icon: '✏️',
      description: 'Professional graphic design services to bring your ideas to life.',
      items: ['Logo Design', 'Brand Identity', 'Marketing Materials', 'Packaging Design', 'Social Media Graphics', 'Illustrations', 'Layout Design', 'Photo Editing']
    },
    {
      title: 'Digital Printing',
      icon: '💻',
      description: 'Quick turnaround digital printing for small to medium print runs.',
      items: ['Business Cards', 'Flyers', 'Postcards', 'Invitations', 'Variable Data Printing', 'Photo Prints', 'Short Run Books', 'Same-Day Printing']
    }
  ]

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const response = await servicesAPI.getAll(true)
      // If we have services from API, use them; otherwise use fallback
      if (response.data.services && response.data.services.length > 0) {
        // Convert API services to display format
        const apiServices = response.data.services.map(service => ({
          title: service.name,
          icon: getServiceIcon(service.name),
          description: service.description,
          price: service.price,
          id: service.id
        }))
        setServices(apiServices)
      } else {
        setServices(fallbackServices)
      }
    } catch (err) {
      console.error('Error loading services:', err)
      setError('Using default services catalog')
      setServices(fallbackServices)
    } finally {
      setLoading(false)
    }
  }

  const getServiceIcon = (name) => {
    const iconMap = {
      'offset': '🖨️',
      'screen': '🎨',
      'banner': '🏳️',
      'large format': '🏳️',
      'video': '🎥',
      'design': '✏️',
      'digital': '💻'
    }
    const key = Object.keys(iconMap).find(k => name.toLowerCase().includes(k))
    return iconMap[key] || '📄'
  }

  const displayServices = services.length > 0 ? services : fallbackServices

  return (
    <div className="pt-24">
      <section className="section-padding bg-gradient-to-br from-primary-900 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Services</h1>
          <p className="text-xl">Complete printing and media production solutions for businesses across Malawi</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          )}

          {!loading && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {displayServices.map((service, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="text-5xl">{service.icon}</div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h2>
                        <p className="text-gray-600">{service.description}</p>
                        {service.price && (
                          <p className="text-primary-600 font-bold mt-2">Starting at ${service.price}</p>
                        )}
                      </div>
                    </div>
                    {service.items && (
                      <div className="grid grid-cols-2 gap-3">
                        {service.items.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-gray-700">
                            <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-16 text-center">
                <Link to="/order" className="btn-primary text-lg">
                  Request a Quote
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Services

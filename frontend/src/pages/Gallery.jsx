import React, { useState, useEffect } from 'react'
import { galleryAPI } from '../api/services'

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [imageErrors, setImageErrors] = useState(new Set())

  const categories = [
    { id: 'all', label: 'All Work' },
    { id: 'offset', label: 'Offset Printing' },
    { id: 'screen', label: 'Screen Printing' },
    { id: 'banner', label: 'Banners' },
    { id: 'video', label: 'Video Production' }
  ]

  // Fallback gallery items with placeholder images
  const fallbackItems = [
    { category: 'offset', title: 'Business Brochures', description: '500 full-color brochures', imageUrl: 'https://images.unsplash.com/photo-1624259395247-f57268575d69?w=800' },
    { category: 'offset', title: 'Magazine Publication', description: '1000 copies, perfect binding', imageUrl: 'https://images.unsplash.com/photo-1598113571597-3a3d9c70b8c8?w=800' },
    { category: 'screen', title: 'Event T-Shirts', description: '200 custom printed shirts', imageUrl: 'https://images.unsplash.com/photo-1739001411231-4fc0f4140259?w=800' },
    { category: 'screen', title: 'Promotional Tote Bags', description: '300 branded bags', imageUrl: 'https://images.unsplash.com/photo-1578237493287-8d4d2b03591a?w=800' },
    { category: 'banner', title: 'Store Front Banner', description: '10ft x 5ft vinyl banner', imageUrl: 'https://images.unsplash.com/photo-1558452919-08ae4aea8e29?w=800' },
    { category: 'banner', title: 'Trade Show Display', description: 'Retractable banner stand', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
    { category: 'video', title: 'Corporate Video', description: '3-minute company profile', imageUrl: 'https://images.unsplash.com/photo-1654723011680-0e037c2a4f18?w=800' },
    { category: 'video', title: 'Product Commercial', description: '30-second TV ad', imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800' },
    { category: 'offset', title: 'Annual Reports', description: '100 page full-color report', imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800' },
    { category: 'screen', title: 'Team Uniforms', description: 'Custom sports jerseys', imageUrl: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800' },
    { category: 'banner', title: 'Billboard Design', description: 'Large format outdoor', imageUrl: 'https://images.unsplash.com/photo-1580670029149-5c00eec8bb66?w=800' },
    { category: 'video', title: 'Event Coverage', description: 'Wedding videography', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800' }
  ]

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      const response = await galleryAPI.getAll()
      if (response.data.items && response.data.items.length > 0) {
        // Convert API items to display format
        const apiItems = response.data.items.map(item => ({
          category: item.category || 'other',
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl
        }))
        setGalleryItems(apiItems)
      } else {
        setGalleryItems(fallbackItems)
      }
    } catch (err) {
      console.error('Error loading gallery:', err)
      setError('Using default gallery items')
      setGalleryItems(fallbackItems)
    } finally {
      setLoading(false)
    }
  }

  const displayItems = galleryItems.length > 0 ? galleryItems : fallbackItems

  const filteredItems = selectedCategory === 'all' 
    ? displayItems 
    : displayItems.filter(item => item.category === selectedCategory)

  const getCategoryIcon = (category) => {
    const iconMap = {
      'offset': '📄',
      'screen': '👕',
      'banner': '🏳️',
      'video': '🎬',
      'other': '📦'
    }
    return iconMap[category] || '📄'
  }

  const handleImageError = (index) => {
    setImageErrors(prev => new Set([...prev, index]))
  }

  return (
    <div className="pt-20">
      <section className="section-padding bg-gradient-to-br from-primary-900 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Gallery</h1>
          <p className="text-xl">Explore our portfolio of successful projects and satisfied clients</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading gallery...</p>
            </div>
          )}

          {!loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item, index) => (
                  <div key={index} className="card group cursor-pointer">
                    <div className="aspect-video overflow-hidden relative">
                      {!imageErrors.has(index) && item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={() => handleImageError(index)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                          <div className="text-6xl group-hover:scale-110 transition-transform">
                            {getCategoryIcon(item.category)}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-xl">No items found in this category</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Gallery
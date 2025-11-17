import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  const team = [
    { name: 'Management Team', role: 'Leadership & Strategy', icon: '👔' },
    { name: 'Design Team', role: 'Creative Professionals', icon: '🎨' },
    { name: 'Production Team', role: 'Print Specialists', icon: '⚙️' },
    { name: 'Video Team', role: 'Media Production', icon: '🎥' }
  ]

  const timeline = [
    { year: '2014', event: 'Everest Printing Press Founded', description: 'Started with basic offset printing services' },
    { year: '2016', event: 'Expanded Services', description: 'Added screen printing and design services' },
    { year: '2018', event: 'New Equipment', description: 'Invested in state-of-the-art printing technology' },
    { year: '2020', event: 'Video Production', description: 'Launched professional video production services' },
    { year: '2024', event: 'Digital Transformation', description: 'Online ordering and expanded digital services' }
  ]

  return (
    <div className="pt-24">
      <section className="section-padding bg-gradient-to-br from-primary-900 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
          <p className="text-xl">Over a decade of excellence in printing and media production</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4 text-lg">
                Everest Printing Press was established in 2014 with a vision to provide 
                high-quality printing services to businesses and individuals across Malawi. 
                Located in the heart of Blantyre at Maselema, behind AGMA House, we've grown 
                from a small offset printing shop to a full-service printing and media production company.
              </p>
              <p className="text-gray-700 mb-4 text-lg">
                Our commitment to quality, customer satisfaction, and continuous innovation 
                has made us the preferred printing partner for hundreds of businesses, 
                organizations, and individuals throughout the country.
              </p>
              <p className="text-gray-700 text-lg">
                Today, we offer a comprehensive range of services including offset printing, 
                screen printing, large format banners, and professional video production, 
                all delivered with the same dedication to excellence that has defined us 
                from day one.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">🏔️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-gray-700 text-lg">
                To deliver exceptional printing and media production services that exceed 
                expectations, while building lasting relationships with our clients through 
                quality, reliability, and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">A decade of growth and innovation</p>
          </div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-32 text-right">
                  <span className="text-3xl font-bold text-primary-600">{item.year}</span>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-primary-600 rounded-full mt-2"></div>
                <div className="flex-grow pb-8 border-l-2 border-primary-200 pl-8 -ml-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.event}</h3>
                  <p className="text-gray-600 text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600">Dedicated professionals committed to your success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-all">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl">
                  {member.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Work With Us?</h2>
          <p className="text-xl mb-8">Let's bring your printing and media projects to life</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/order" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all text-lg shadow-lg">
              Start Your Project
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

export default About

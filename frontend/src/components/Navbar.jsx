import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  const isHome = location.pathname === '/'

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled || !isHome ? 'bg-white shadow-lg py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform">
              <span className="text-white font-bold text-xl">EP</span>
            </div>
            <div>
              <h1 className={`font-bold text-xl ${isScrolled || !isHome ? 'text-gray-900' : 'text-white'}`}>
                Everest Printing
              </h1>
              <p className={`text-xs ${isScrolled || !isHome ? 'text-gray-600' : 'text-gray-200'}`}>
                Press Excellence
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors relative group ${
                  location.pathname === link.path
                    ? (isScrolled || !isHome ? 'text-primary-600' : 'text-white')
                    : (isScrolled || !isHome ? 'text-gray-700 hover:text-primary-600' : 'text-gray-200 hover:text-white')
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full ${
                  location.pathname === link.path ? 'w-full' : ''
                }`}></span>
              </Link>
            ))}
            
            {user ? (
              <>
                <span className={`text-sm ${isScrolled || !isHome ? 'text-gray-600' : 'text-gray-200'}`}>
                  {user.name}
                </span>
                <button onClick={handleLogout} className="btn-primary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`font-medium ${isScrolled || !isHome ? 'text-gray-700 hover:text-primary-600' : 'text-gray-200 hover:text-white'}`}>
                  Login
                </Link>
                <Link to="/order" className="btn-primary">
                  Order Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${isScrolled || !isHome ? 'text-gray-900' : 'text-white'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-xl p-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <>
                <div className="py-3 px-4 text-gray-600 text-sm border-t mt-2">
                  Welcome, {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center mt-2 py-3 px-4 rounded-lg font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mt-4 text-center py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mt-2 text-center py-3 px-4 rounded-lg font-medium text-primary-600 hover:bg-primary-50"
                >
                  Sign Up
                </Link>
              </>
            )}
            
            <Link
              to="/order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block mt-4 text-center btn-primary"
            >
              Order Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

// API configuration for different environments
const getApiBase = () => {
  // Production environment
  if (import.meta.env.PROD) {
    // If deployed on Vercel, use the same domain
    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
      return window.location.origin
    }
    // Custom production domain
    return import.meta.env.VITE_API_BASE || 'https://your-domain.vercel.app'
  }
  
  // Development environment
  return import.meta.env.VITE_API_BASE || 'http://localhost:4000'
}

export const API_BASE = getApiBase()



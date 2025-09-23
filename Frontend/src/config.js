// API configuration for separate deployments
const getApiBase = () => {
  // Production environment
  if (import.meta.env.PROD) {
    // Use environment variable for backend URL
    return import.meta.env.VITE_API_BASE || 'https://your-backend-project.vercel.app'
  }
  
  // Development environment
  return import.meta.env.VITE_API_BASE || 'http://localhost:4000'
}

export const API_BASE = getApiBase()



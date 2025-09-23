// API configuration for separate deployments
const getApiBase = () => {
  // Production environment
  if (import.meta.env.PROD) {
    // Use environment variable for backend URL
    const baseUrl = import.meta.env.VITE_API_BASE || 'https://your-backend-project.vercel.app'
    // Ensure no trailing slash to prevent double slashes
    return baseUrl.replace(/\/$/, '')
  }
  
  // Development environment
  const baseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
  return baseUrl.replace(/\/$/, '')
}

export const API_BASE = getApiBase()



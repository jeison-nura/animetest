import { NextConfig } from 'next'
 
const config: NextConfig = {
  // Reducir la salida de consola y mejorar la experiencia de desarrollo
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
}
 
export default config
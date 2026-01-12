import { Inter, Poppins } from 'next/font/google';

// Primary font - reduced weights for faster loading
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Only essential weights
  variable: '--font-inter',
  display: 'optional', // Faster FCP - uses system font if not ready
  preload: true,
});

// Accent font for headings only - minimal weights
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'], // Only for headings
  variable: '--font-poppins',
  display: 'optional', // Faster FCP
  preload: false, // Load after Inter
});

// Removed Roboto - using Inter as primary font to reduce load time



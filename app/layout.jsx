import './globals.css'
import { Suspense } from 'react'


export const metadata = {
  title: 'Chennai to Tirupati Tour Packages | Tirupati Tours| Temple Tour Packages - Garuda Tours & Travels',
  description: 'Explore affordable Chennai to Tirupati tour packages with Garuda Tours & Travels. Hassle-free temple visits, VIP darshan, and customized itineraries. Book your Tirupati temple tour today!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense>
        
        <main>{children}</main>
      
      
        </Suspense> 
      </body>
    </html>
  )
}


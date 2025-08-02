import './globals.css'
import { Suspense } from 'react'


export const metadata = {
  title: 'Garuda Tours And Travels',
  description: 'Your trusted partner for hassle-free Chennai to Tirupati tour packages.',
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


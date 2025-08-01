import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'


export const metadata = {
  title: 'Garuda Tours And Travels',
  description: 'Your trusted partner for hassle-free Chennai to Tirupati tour packages.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        <Header />
        <main>{children}</main>
        <Footer />
      
        
      </body>
    </html>
  )
}


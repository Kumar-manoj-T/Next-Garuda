import Image from "next/image"
import { Phone, Mail, MapPin, ChevronRight, Facebook, Instagram, MessageCircleMore } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 relative">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img src="/footer-logo.png" alt="Logo" className="h-6 md:h-8 lg:h-10 w-auto" />
          <p className="mb-6 text-sm leading-relaxed mt-4">
            Garuda Tours and Travels offers trusted Chennai to Tirupati packages, VIP darshan trips, and temple tour packages with comfort, care, and devotion.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              aria-label="Facebook"
              className="border border-gray-600 p-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <Facebook className="h-5 w-5 text-white" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="border border-gray-600 p-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <Instagram className="h-5 w-5 text-white" />
            </a>
            <a
              href="#"
              aria-label="WhatsApp"
              className="border border-gray-600 p-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              {/* Using a generic phone icon for WhatsApp in social links, as the floating one is a GIF */}
              <Phone className="h-5 w-5 text-white" />
            </a>
          </div>
        </div>

        {/* Our Services */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Our Services</h3>
          <ul className="space-y-3">
            <li>
              <a href="#" className="flex items-center hover:text-blue-400 transition-colors">
                <ChevronRight className="h-4 w-4 mr-2 text-blue-400" /> VIP Break Darshan
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center hover:text-blue-400 transition-colors">
                <ChevronRight className="h-4 w-4 mr-2 text-blue-400" /> One Day Tirupati Tour
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center hover:text-blue-400 transition-colors">
                <ChevronRight className="h-4 w-4 mr-2 text-blue-400" /> Chennai to Tirupati Tour
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center hover:text-blue-400 transition-colors">
                <ChevronRight className="h-4 w-4 mr-2 text-blue-400" /> Vellore to Tirupati Tour
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center hover:text-blue-400 transition-colors">
                <ChevronRight className="h-4 w-4 mr-2 text-blue-400" /> Bangalore to Tirupati Tour
              </a>
            </li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Useful Links</h3>
          <ul className="space-y-3">
            <li>
              <a href="tel:9840789844" className="flex items-center hover:text-blue-400 transition-colors">
                <Phone className="h-4 w-4 mr-2 text-blue-400" /> 9840789844, 9840789857
              </a>
            </li>
            <li>
              <a href="mailto:garudattd1@gmail.com" className="flex items-center hover:text-blue-400 transition-colors">
                <Mail className="h-4 w-4 mr-2 text-blue-400" /> garudattd1@gmail.com
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center hover:text-blue-400 transition-colors">
                <ChevronRight className="h-4 w-4 mr-2 text-blue-400" /> Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center hover:text-blue-400 transition-colors">
                <ChevronRight className="h-4 w-4 mr-2 text-blue-400" /> Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Locations */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Locations</h3>
          <ul className="space-y-3">
            <li>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 text-blue-400 flex-shrink-0" />
                <span>No.83, Nehru Nagar, 1st Street, 13th Main Road, Anna Nagar West, Chennai</span>
              </div>
            </li>
            <li>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 text-blue-400 flex-shrink-0" />
                <span>
                  No.9, Netaji Nagar, RV Nagar, Last main road Near R V Nagar water tank Kodungaiyur Chennai 118
                </span>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className=" text-gray-400 text-sm py-4 mt-4">
        {/* Reduced mt-12 to mt-8 */}
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="mb-2 md:mb-0">Copyright © 2024 Garuda Tours & Travels All rights reserved.</p>
        </div>
      </div>

      {/* Floating Buttons (GIFs) */}
      <a
        href="tel:9840789844"
        aria-label="Call Us"
        className="fixed bottom-4 left-4 bg-blue-500 p-3 rounded-full shadow-lg z-50 hover:bg-blue-600 transition-colors flex items-center justify-center animate-bounce hover:scale-110 transition-transform"
      >
        <Phone className="h-6 w-6 text-white" />
      </a>
      <a
        href="https://wa.me/919840789844"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Chat"
        className="fixed bottom-4 right-4 bg-green-500 p-3 rounded-full shadow-lg z-50 hover:bg-green-600 transition-colors flex items-center justify-center animate-bounce hover:scale-110 transition-transform"
      >
        <MessageCircleMore className="h-6 w-6 text-white" />
      </a>
    </footer>
  )
}


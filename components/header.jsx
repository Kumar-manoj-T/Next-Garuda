"use client"

import { useState } from "react"
import { MapPin, PhoneCall } from "lucide-react" // Assuming lucide-react is available or you'll use custom SVGs
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">TravelCo</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </a>
            <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About Us
            </a>

            {/* Packages Dropdown with Button as Trigger */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Packages
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <a href="#" className="w-full">
                    Tirupati Package
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a href="#" className="w-full">
                    Car Rental Package
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a href="#" className="w-full">
                    Temple Tour Package
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Gallery
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact Us
            </a>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <PhoneCall className="h-8 w-8 text-[#4CAF50]" /> {/* Light green icon */}
            <div className="h-10 border-l border-gray-300" /> {/* Vertical separator */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-700">To More Inquiry</span>
              <a
                href="tel:+919840789857"
                className="text-lg font-bold text-[#4CAF50] hover:text-[#45a049] transition-colors"
              >
                +91 98407-89857
              </a>
            </div>
          </div>


          {/* Mobile Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <a href="/" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition-colors">
                  Home
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition-colors">
                  About Us
                </a>
                {/* Mobile Packages Section - simplified for Sheet */}
                <div className="space-y-2">
                  <span className="text-gray-700 font-medium text-lg">Packages</span>
                  <div className="pl-4 space-y-2">
                    <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">
                      Tirupati Package
                    </a>
                    <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">
                      Car Rental Package
                    </a>
                    <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">
                      Temple Tour Package
                    </a>
                  </div>
                </div>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition-colors">
                  Gallery
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition-colors">
                  Contact Us
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

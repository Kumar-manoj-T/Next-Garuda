"use client"

import { useState, useEffect } from "react"
import { MapPin, PhoneCall, Menu, X, ChevronDown, User, Calendar, Car, Crown, Repeat1, CarFront } from 'lucide-react'
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileDropdowns, setMobileDropdowns] = useState({
    tirupati: false,
    carRental: false,
    templeTour: false,
  })
  const [carRentalPackages, setCarRentalPackages] = useState([])
  const [templePackages, setTemplePackages] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch dynamic packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Fetch car rental packages
        const carRentalSnapshot = await getDocs(collection(db, "carRentalPackages"))
        const carRentalData = carRentalSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setCarRentalPackages(carRentalData)

        // Fetch temple packages
        const templeSnapshot = await getDocs(collection(db, "templePackages"))
        const templeData = templeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setTemplePackages(templeData)
      } catch (error) {
        console.error("Error fetching packages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleMobileDropdown = (dropdown) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }))
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-[1470px] mx-auto ">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/logo.webp" alt="Logo" className="h-6 md:h-8 lg:h-10 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Home
            </a>
            <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              About
            </a>

            {/* Tirupati Packages Dropdown - Keep as is */}
            <div className="relative group">
              <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 border-b-2 border-blue-600">
                Tirupati Packages
                <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-[600px] bg-[#f5ece1] rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-6 grid grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Chennai to Tirupati */}
                    <div>
                      <h3 className="text-blue-600 font-semibold text-lg mb-3">Chennai to Tirupati</h3>
                      <div className="space-y-2">
                        <a
                          href="/tirupati-package/chennai-to-tirupati"
                          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-150 py-1"
                        >
                          <Repeat1 className="h-4 w-4 mr-2" />
                          One Day Package
                        </a>
                        <a
                          href="/tirupati-package/tirupati-two-days-package-from-chennai"
                          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-150 py-1"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Two Days Package
                        </a>
                        <a
                          href="/tirupati-package/chennai-tirupati-car-rental-package"
                          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-150 py-1"
                        >
                          <Car className="h-4 w-4 mr-2" />
                          Car Rental Package
                        </a>
                        <a
                          href="/tirupati-package/srivani-vip-break-darshan"
                          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-150 py-1"
                        >
                          <Crown className="h-4 w-4 mr-2" />
                          VIP Darshan
                        </a>
                      </div>
                    </div>

                    {/* Vellore to Tirupati */}
                    <div>
                      <h3 className="text-blue-600 font-semibold text-lg mb-3">Vellore to Tirupati</h3>
                      <div className="space-y-2">
                        <a
                          href="/tirupati-package/vellore-tirupati-one-day-tour-package"
                          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-150 py-1"
                        >
                          <Repeat1 className="h-4 w-4 mr-2" />
                          One Day Package
                        </a>
                        <a
                          href="/tirupati-package/vellore-to-tirupati"
                          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-150 py-1"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Two Days Package
                        </a>
                      </div>
                    </div>

                    {/* Bangalore to Tirupati */}
                    <div>
                      <h3 className="text-blue-600 font-semibold text-lg mb-3">Bangalore to Tirupati</h3>
                      <div className="space-y-2">
                        <a
                          href="/tirupati-package/bangalore-tirupati-darshan-tour-package"
                          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-150 py-1"
                        >
                          <Repeat1 className="h-4 w-4 mr-2" />
                          One Day Package
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Kanchipuram To Tirupati */}
                    <div>
                      <h3 className="text-blue-600 font-semibold text-lg mb-3">Kanchipuram To Tirupati</h3>
                      <div className="space-y-2">
                        <a
                          href="/tirupati-package/kanchipuram-tirupati-one-day-tour-package"
                          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-150 py-1"
                        >
                          <Repeat1 className="h-4 w-4 mr-2" />
                          One Day Package
                        </a>
                        <a
                          href="/tirupati-package/kanchipuram-tirupati-two-days-tour-package"
                          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-150 py-1"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Two Days Package
                        </a>
                      </div>
                    </div>

                    {/* Tirumala to Tirupati */}
                    <div>
                      <h3 className="text-blue-600 font-semibold text-lg mb-3">Tirumala to Tirupati</h3>
                      <div className="space-y-2">
                        <a
                          href="/tirupati-package/tirumala-tirupati-darshan-one-day-package"
                          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-150 py-1"
                        >
                          <Repeat1 className="h-4 w-4 mr-2" />
                          One Day Package
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Car Rental Packages Dropdown - Dynamic */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Car Rental Packages
                <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-80 bg-[#f5ece1] rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div className="py-2">
                  {loading ? (
                    <div className="px-4 py-3 text-gray-500">Loading...</div>
                  ) : carRentalPackages.length > 0 ? (
                    carRentalPackages.map((pkg) => (
                      <a
                        key={pkg.id}
                        href={`/car-rental/${pkg.id}`}
                        className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                      > 
                        <div className="font-medium">{pkg.title}</div>
                        {pkg.shortDescription && (
                          <div className="text-sm text-gray-500 truncate">{pkg.shortDescription}</div>
                        )}
                      </a>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">No packages available</div>
                  )}
                </div>
              </div>
            </div>

            {/* Temple Tour Packages Dropdown - Dynamic */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                Temple Tour Packages
                <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-80 bg-[#f5ece1] rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div className="py-2">
                  {loading ? (
                    <div className="px-4 py-3 text-gray-500">Loading...</div>
                  ) : templePackages.length > 0 ? (
                    templePackages.map((pkg) => (
                      <a
                        key={pkg.id}
                        href={`/temple-tour-package/${pkg.id}`}
                        className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                      >
                        <div className="font-medium">{pkg.title}</div>
                        {pkg.shortDescription && (
                          <div className="text-sm text-gray-500 truncate">{pkg.shortDescription}</div>
                        )}
                      </a>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">No packages available</div>
                  )}
                </div>
              </div>
            </div>

            <a href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Contact
            </a>
          </nav>

          {/* Phone Inquiry Section (Desktop Only) */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
              <PhoneCall className="h-5 w-5 text-green-600" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-600 font-medium">For Inquiry</span>
                <a
                  href="tel:+919840789844"
                  className="text-sm font-bold text-green-600 hover:text-green-700 transition-colors duration-200"
                >
                  +91 98407 89844
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {/* Mobile Navigation Off-Canvas */}
        <div
          className={`lg:hidden fixed inset-0 z-[60] ${isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
          aria-hidden={!isMobileMenuOpen}
        >
          {/* Backdrop */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
            aria-label="Close menu backdrop"
          />

          {/* Panel */}
          <div
            className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
          >
            <nav className="py-4 space-y-2 border-t border-gray-100 h-full overflow-y-auto">
              {/* Keep the ENTIRE existing mobile menu content below exactly as-is */}
              <a
                href="/"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="/under-construction"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
              >
                About Us
              </a>

              {/* Mobile Tirupati Packages Dropdown - Keep as is */}
              <div className="space-y-1">
                <button
                  onClick={() => toggleMobileDropdown("tirupati")}
                  className="flex items-center justify-between w-full px-4 py-3 text-blue-600 font-semibold hover:bg-blue-50 rounded-md transition-colors duration-200"
                >
                  Tirupati Packages
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${mobileDropdowns.tirupati ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${mobileDropdowns.tirupati ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="pl-6 space-y-2 pb-2">
                    <div className="text-sm font-medium text-blue-600 px-4 py-1">Chennai to Tirupati</div>
                    <a
                      href="/tirupati-package/chennai-to-tirupati"
                      className="flex items-center px-6 py-1 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 text-sm"
                    >
                      <User className="h-3 w-3 mr-2" />
                      One Day Package
                    </a>
                    <a
                      href="/tirupati-package/tirupati-two-days-package-from-chennai"
                      className="flex items-center px-6 py-1 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 text-sm"
                    >
                      <Calendar className="h-3 w-3 mr-2" />
                      Two Days Package
                    </a>
                    <a
                      href="/tirupati-package/chennai-tirupati-car-rental-package"
                      className="flex items-center px-6 py-1 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 text-sm"
                    >
                      <Car className="h-3 w-3 mr-2" />
                      Car Rental Package
                    </a>
                    <a
                      href="/tirupati-package/srivani-vip-break-darshan"
                      className="flex items-center px-6 py-1 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 text-sm"
                    >
                      <Crown className="h-3 w-3 mr-2" />
                      VIP Darshan
                    </a>

                    <div className="text-sm font-medium text-blue-600 px-4 py-1 mt-2">Vellore to Tirupati</div>
                    <a
                      href="/tirupati-package/vellore-tirupati-one-day-tour-package"
                      className="flex items-center px-6 py-1 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 text-sm"
                    >
                      <User className="h-3 w-3 mr-2" />
                      One Day Package
                    </a>
                    <a
                      href="/tirupati-package/vellore-to-tirupati"
                      className="flex items-center px-6 py-1 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 text-sm"
                    >
                      <Calendar className="h-3 w-3 mr-2" />
                      Two Days Package
                    </a>

                    <div className="text-sm font-medium text-blue-600 px-4 py-1 mt-2">Bangalore to Tirupati</div>
                    <a
                      href="/tirupati-package/bangalore-tirupati-darshan-tour-package"
                      className="flex items-center px-6 py-1 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 text-sm"
                    >
                      <User className="h-3 w-3 mr-2" />
                      One Day Package
                    </a>

                    <div className="text-sm font-medium text-blue-600 px-4 py-1 mt-2">Kanchipuram To Tirupati</div>
                    <a
                      href="/tirupati-package/kanchipuram-tirupati-one-day-tour-package"
                      className="flex items-center px-6 py-1 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 text-sm"
                    >
                      <User className="h-3 w-3 mr-2" />
                      One Day Package
                    </a>
                    <a
                      href="/tirupati-package/kanchipuram-tirupati-two-days-tour-package"
                      className="flex items-center px-6 py-1 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 text-sm"
                    >
                      <Calendar className="h-3 w-3 mr-2" />
                      Two Days Package
                    </a>

                    <div className="text-sm font-medium text-blue-600 px-4 py-1 mt-2">Tirumala to Tirupati</div>
                    <a
                      href="/tirupati-package/tirumala-tirupati-darshan-one-day-package"
                      className="flex items-center px-6 py-1 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 text-sm"
                    >
                      <User className="h-3 w-3 mr-2" />
                      One Day Package
                    </a>
                  </div>
                </div>
              </div>

              {/* Mobile Car Rental Packages Dropdown - Dynamic */}
              <div className="space-y-1">
                <button
                  onClick={() => toggleMobileDropdown("carRental")}
                  className="flex items-center justify-between w-full px-4 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                >
                  Car Rental Packages
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${mobileDropdowns.carRental ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${mobileDropdowns.carRental ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="pl-6 space-y-1 pb-2">
                    {loading ? (
                      <div className="px-4 py-2 text-gray-500 text-sm">Loading...</div>
                    ) : carRentalPackages.length > 0 ? (
                      carRentalPackages.map((pkg) => (
                        <a
                          key={pkg.id}
                          href={`/car-rental/${pkg.id}`}
                          className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 text-sm"
                        >
                          {pkg.title}
                        </a>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">No packages available</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Temple Tour Packages Dropdown - Dynamic */}
              <div className="space-y-1">
                <button
                  onClick={() => toggleMobileDropdown("templeTour")}
                  className="flex items-center justify-between w-full px-4 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
                >
                  Temple Tour Packages
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${mobileDropdowns.templeTour ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${mobileDropdowns.templeTour ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="pl-6 space-y-1 pb-2">
                    {loading ? (
                      <div className="px-4 py-2 text-gray-500 text-sm">Loading...</div>
                    ) : templePackages.length > 0 ? (
                      templePackages.map((pkg) => (
                        <a
                          key={pkg.id}
                          href={`/temple-tour-package/${pkg.id}`}
                          className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 text-sm"
                        >
                          {pkg.title}
                        </a>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">No packages available</div>
                    )}
                  </div>
                </div>
              </div>

              {/* <a
                href="/under-construction"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
              >
                Gallery
              </a> */}
              <a
                href="/contact"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
              >
                Contact Us
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

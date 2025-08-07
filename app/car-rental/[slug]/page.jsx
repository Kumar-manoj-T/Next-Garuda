"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import BookingForm from "@/components/booking-form"
import PermitFeeSection from "@/components/permit-fee"
import VehiclePricing from "@/components/vehicle-price"
import Link from "next/link"
import { ChevronRight, BadgeCheck, Users, Fuel, Settings, Clock, Shield } from 'lucide-react'
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatePresence, motion } from 'framer-motion';

function CarRentalPage() {
  const params = useParams()
  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openIndex, setOpenIndex] = useState(null);


  useEffect(() => {
    async function fetchPackageData() {
      try {
        setLoading(true)
        const querySnapshot = await getDocs(collection(db, "carRentalPackages"))
        const packages = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        const foundPackage = packages.find((pkg) => pkg.url === params.slug)
        
        if (foundPackage) {
          setPackageData(foundPackage)
        } else {
          setError("Car rental package not found")
        }
      } catch (err) {
        console.error("Error fetching car rental package:", err)
        setError("Failed to load car rental package")
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchPackageData()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading car rental package...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Package Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The requested car rental package could not be found."}</p>
            <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all">
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-red-100 py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            {packageData.title || "Car Rental Service"}
          </h1>
          <nav className="text-sm text-gray-600 flex justify-center items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline text-gray-700 font-medium">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/car-rental" className="hover:underline text-gray-700 font-medium">
              Car Rental
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 font-medium">{packageData.title}</span>
          </nav>
        </div>
      </section>
       
      {/* Main Content Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left - Image */}
          <div className="w-full">
            <img
              src={packageData.images?.[0] || "/placeholder.svg?height=400&width=600&query=car rental service"}
              alt={packageData.title}
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>

          {/* Right - Content */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">{packageData.title}</h2>
            {packageData.subtitle && (
              <p className="text-xl text-gray-700 font-medium">{packageData.subtitle}</p>
            )}
            <div className="text-gray-600 space-y-3">
              <p>{packageData.content || ""}</p>
            </div>
            <a href="#booking">
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all">
                Book Now
              </button>
            </a>
          </div>
        </div>
      </section>

   

      <div id="booking">
        <BookingForm />
      </div>


      {/* Car Types Section */}
      {packageData.carTypes && packageData.carTypes.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Available Vehicles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packageData.carTypes.map((car, index) => (
                <Card key={car.id || index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {car.imageUrl && (
                    <div className="aspect-video relative">
                      <img
                        src={car.imageUrl || "/placeholder.svg?height=200&width=300&query=car rental vehicle"}
                        alt={car.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{car.name}</h3>
                    
                    {/* Car Specifications */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {car.seating && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{car.seating} Seater</span>
                        </div>
                      )}
                      {car.fuelType && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Fuel className="w-4 h-4" />
                          <span>{car.fuelType}</span>
                        </div>
                      )}
                      {car.transmission && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Settings className="w-4 h-4" />
                          <span>{car.transmission}</span>
                        </div>
                      )}
                    </div>

                    {/* Car Features */}
                    {car.features && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Features:</h4>
                        <p className="text-sm text-gray-600">{car.features}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Features Section */}
      {packageData.serviceFeatures && packageData.serviceFeatures.length > 0 && (
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Service Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packageData.serviceFeatures.map((feature, index) => (
                <div key={feature.id || index} className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BadgeCheck className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.text}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Plans Section */}
      {packageData.pricingPlans && packageData.pricingPlans.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Pricing Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packageData.pricingPlans.map((plan, index) => (
                <Card key={plan.id || index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.duration}</h3>
                    <div className="text-2xl font-bold text-blue-600 mb-4">{plan.price}</div>
                    
                    {/* Plan Features */}
                    {plan.features && plan.features.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Features:</h4>
                        <ul className="space-y-1">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={feature.id || featureIndex} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-green-500 mt-1">✓</span>
                              <span>{feature.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

         {/* Dynamic Sections */}
      {packageData.sections && packageData.sections.length > 0 && (
        <div className="space-y-12">
          {packageData.sections.map((section, index) => (
            <section key={section.id || index} className="py-12 px-4 bg-white">
              <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Content */}
                  <div className="space-y-4">
                    {section.contentTitle && (
                      <h2 className="text-3xl font-bold text-gray-800">{section.contentTitle}</h2>
                    )}
                    {section.contentDescription && (
                      <div 
                        className="text-gray-600 space-y-3"
                        dangerouslySetInnerHTML={{ __html: section.contentDescription }}
                      />
                    )}
                    {section.listInfo && section.listInfo.length > 0 && (
                      <ul className="space-y-2">
                        {section.listInfo.map((item, itemIndex) => (
                          <li key={item.id || itemIndex} className="flex items-start gap-2 text-gray-700">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Image */}
                  {section.imageUrl && (
                    <div className="w-full">
                      <img
                        src={section.imageUrl || "/placeholder.svg"}
                        alt={section.contentTitle || `Section ${index + 1}`}
                        className="rounded-lg shadow-lg w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Terms and Conditions Section */}
      {packageData.termsAndConditions && packageData.termsAndConditions.length > 0 && (
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Terms and Conditions</h2>
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {packageData.termsAndConditions.map((term, index) => (
                    <li key={term.id || index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{term.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {/* {packageData.faqs && packageData.faqs.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {packageData.faqs.map((faq, index) => (
                <Card key={faq.id || index}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )} */}

      {packageData.faqs && packageData.faqs.length > 0 && (
  <section className="py-12 px-4 bg-gray-50">
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Frequently Asked Questions
      </h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {packageData.faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={faq.id || index}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center p-5 text-left focus:outline-none hover:bg-gray-100 transition"
              >
                <span className="text-lg font-medium text-gray-800">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 text-gray-700 text-sm">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  </section>
)}


      {/* Vehicle Features Component */}
      {/* <VehicleFeatures /> */}
      
  
     
      
      {/* Permit Fee Section */}
      {/* <PermitFeeSection /> */}
      
      <Footer />
    </div>
  )
}

export default CarRentalPage

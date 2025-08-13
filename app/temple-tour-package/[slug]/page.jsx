"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import BookingForm from "@/components/booking-form"
import Link from "next/link"
import {
  ChevronRight,
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MessageCircle,
  Camera,
  Route,
  Info,
  Award,
  Shield,
  Car,
  IndianRupee,
  Eye,
  Headset,
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

function TemplePackagePage() {
  const params = useParams()
  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    async function fetchPackageData() {
      try {
        setLoading(true)
        const querySnapshot = await getDocs(collection(db, "templePackages"))
        const packages = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        const foundPackage = packages.find((pkg) => pkg.url === params.slug)

        if (foundPackage && foundPackage.isActive) {
          setPackageData(foundPackage)
        } else {
          setError("Temple package not found or inactive")
        }
      } catch (err) {
        console.error("Error fetching temple package:", err)
        setError("Failed to load temple package")
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchPackageData()
    }
  }, [params.slug])


  const renderIcon = (iconName) => {
    const iconMap = {
      Shield,
      Award,
      Clock,
      Phone,
      Star,
      Users,
      CheckCircle,
      Car,
      MapPin,
      Calendar,
      Mail,
      MessageCircle,
      Camera,
      Route,
      Info,
      IndianRupee,
      Eye,
      Headset,
    }
    const IconComponent = iconMap[iconName] || Shield
    return <IconComponent className="w-8 h-8" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading temple package...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Package Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The requested temple package could not be found."}</p>
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb Section */}
      {/* <section className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-gray-600 flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/temple-tours" className="hover:text-blue-600 transition-colors">
              Temple Tours
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-800 font-medium">{packageData.title}</span>
          </nav>
        </div>
      </section> */}

      {/* Hero Section */}
      {/* <section className="bg-orange-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">{packageData.title}</h1>
            {packageData.subtitle && <p className="text-lg md:text-xl text-gray-600 mb-6">{packageData.subtitle}</p>}
            <div className="flex flex-wrap justify-center items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                <Clock className="w-4 h-4" />
                {packageData.days} Days
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <MapPin className="w-4 h-4" />
                Temple Tour
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <Users className="w-4 h-4" />
                All Group Sizes
              </Badge>
            </div>
          </div>
        </div>
      </section> */}

      <section className="bg-orange-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">

            {/* Left Side - Text */}
            <div className="text-left max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                {packageData.title}
              </h1>
              {packageData.subtitle && (
                <p className="text-lg md:text-xl text-gray-600 mb-6">
                  {packageData.subtitle}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  <Clock className="w-4 h-4" />
                  {packageData.days} Days
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  <MapPin className="w-4 h-4" />
                  Temple Tour
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  <Users className="w-4 h-4" />
                  All Group Sizes
                </Badge>
              </div>
            </div>

            {/* Right Side - Static Image */}
            <div className="flex justify-center">
              <img
                src="/images/2.png" // static image path
                alt="Tour Package"
                className="rounded-lg shadow-lg w-full max-w-md object-cover"
              />
            </div>

          </div>
        </div>
      </section>


      {/* Image Gallery Section */}
      {packageData.images && packageData.images.length > 0 && (
        <section className="bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Main Image */}
              <div className="mb-6">
                <img
                  src={
                    packageData.images[activeImageIndex] || "/placeholder.svg?height=400&width=800&query=temple tour"
                  }
                  alt={`${packageData.title} - Image ${activeImageIndex + 1}`}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Thumbnail Images */}
              {packageData.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {packageData.images.slice(0, 6).map((image, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === index ? "border-blue-500" : "border-transparent"
                        }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-20 h-16 object-cover hover:opacity-80 transition-opacity"
                      />
                    </div>
                  ))}
                  {packageData.images.length > 6 && (
                    <div className="flex-shrink-0 w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                      <div className="text-center">
                        <Eye className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                        <span className="text-xs text-gray-600">+{packageData.images.length - 6}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Booking Form */}
      <div id="booking">
        <BookingForm />
      </div>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              {/* Package Overview */}
              {packageData.content && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Info className="w-6 h-6 text-blue-600" />
                    Package Overview
                  </h2>
                  <div className="space-y-4">
                    {packageData.content
                      .split(
                        /(?=Departure & Return:|Distance Covered:|Vehicle Options:|Tour Duration:|Highlights:|Includes:|Excludes:)/,
                      )
                      .map((section, index) => {
                        if (!section.trim()) return null

                        // Extract section title and content
                        const lines = section
                          .trim()
                          .split("\n")
                          .filter((line) => line.trim())
                        if (lines.length === 0) return null

                        const firstLine = lines[0]
                        const isStructuredSection = firstLine.includes(":")

                        if (isStructuredSection) {
                          const [title, ...contentLines] = firstLine.split(":")
                          const remainingContent = lines.slice(1).join(" ")
                          const fullContent = contentLines.join(":") + " " + remainingContent

                          // Handle Includes and Excludes specially
                          if (title.trim() === "Includes") {
                            return (
                              <div
                                key={index}
                                className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-lg"
                              >
                                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" />
                                  {title.trim()}:
                                </h4>
                                <p className="text-gray-700 leading-relaxed flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  {fullContent.trim()}
                                </p>
                              </div>
                            )
                          } else if (title.trim() === "Excludes") {
                            return (
                              <div key={index} className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded-r-lg">
                                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                                  <XCircle className="w-4 h-4" />
                                  {title.trim()}:
                                </h4>
                                <p className="text-gray-700 leading-relaxed flex items-start gap-2">
                                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                  {fullContent.trim()}
                                </p>
                              </div>
                            )
                          } else {
                            // Regular structured sections
                            return (
                              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                                <h4 className="font-semibold text-gray-800 mb-1">{title.trim()}:</h4>
                                <p className="text-gray-700 leading-relaxed">{fullContent.trim()}</p>
                              </div>
                            )
                          }
                        } else {
                          // Regular paragraph content
                          return (
                            <div key={index} className="text-gray-700 leading-relaxed">
                              <p>{section.trim()}</p>
                            </div>
                          )
                        }
                      })}
                  </div>
                </div>
              )}

              {/* Tour Highlights */}
              {packageData.tourHighlights && packageData.tourHighlights.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500" />
                    Tour Highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packageData.tourHighlights.map((highlight, index) => (
                      <div key={highlight.id || index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{highlight.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Temple List */}
              {packageData.templeList && packageData.templeList.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6 text-orange-500" />
                    Temples to Visit
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {packageData.templeList.map((temple, index) => (
                      <div
                        key={temple.id || index}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        {temple.imageUrl && (
                          <img
                            src={temple.imageUrl || "/placeholder.svg"}
                            alt={temple.name}
                            className="w-full h-60 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h4 className="font-semibold text-gray-800 mb-2">{temple.name}</h4>
                        {temple.description && (
                          <p className="text-sm text-gray-600 leading-relaxed">{temple.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {packageData.itineraries && packageData.itineraries.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Route className="w-6 h-6 text-blue-600" />
                    Detailed Itinerary
                  </h2>
                  <div className="space-y-4">
                    {packageData.itineraries.map((item, index) => (
                      <div key={item.id || index} className="flex gap-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sightseeing Places */}
              {packageData.sightseeingPlaces && packageData.sightseeingPlaces.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Camera className="w-6 h-6 text-purple-600" />
                    Sightseeing Places
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packageData.sightseeingPlaces.map((place, index) => (
                      <div
                        key={place.id || index}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-gray-800 mb-2">{place.name}</h4>
                        {place.description && (
                          <p className="text-sm text-gray-600 leading-relaxed">{place.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Sections */}
              {packageData.sections && packageData.sections.length > 0 && (
                <div className="space-y-6">
                  {packageData.sections.map((section, index) => (
                    <div key={section.id || index} className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
                      <div
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inclusions */}
                {packageData.includes && packageData.includes.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                    <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      What's Included
                    </h3>
                    <ul className="space-y-3">
                      {packageData.includes.map((item, index) => (
                        <li key={item.id || index} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Exclusions */}
                {packageData.excludes && packageData.excludes.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
                    <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      What's Not Included
                    </h3>
                    <ul className="space-y-3">
                      {packageData.excludes.map((item, index) => (
                        <li key={item.id || index} className="flex items-start gap-3">
                          <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Important Notes */}
              {packageData.importantNotes && packageData.importantNotes.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Important Notes
                  </h3>
                  <ul className="space-y-3">
                    {packageData.importantNotes.map((note, index) => (
                      <li key={note.id || index} className="flex items-start gap-3">
                        <span className="text-yellow-600 mt-1 font-bold">•</span>
                        <span className="text-sm text-gray-700">{note.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* FAQs */}
              {packageData.faqs && packageData.faqs.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                    Frequently Asked Questions
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {packageData.faqs.map((faq, index) => (
                      <AccordionItem key={faq.id || index} value={`item-${index}`} className="border-b border-gray-200">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="text-base font-bold text-gray-800">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div
                            className="text-gray-600 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>

            {/* Right Sidebar - 1/3 width */}
            <div className="space-y-6">

              {/* Quick Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Duration</p>
                      <p className="text-sm text-gray-600">{packageData.days} Days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Type</p>
                      <p className="text-sm text-gray-600">Temple Tour Package</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Group Size</p>
                      <p className="text-sm text-gray-600">Flexible</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Availability</p>
                      <p className="text-sm text-gray-600">24/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about this temple tour package? Our travel experts are here to help!
                </p>
                <div className="space-y-3">
                  <a href="tel:9840789844">

                    <Button variant="outline" className="w-full justify-start hover:bg-blue-50">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Us
                    </Button>
                  </a>
                  <a href="mail:garudattd1@gmail.com">
                    <Button variant="outline" className="w-full justify-start hover:bg-blue-50">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Us
                    </Button>

                  </a>

                  <a href="tel:9840789857">
                    <Button variant="outline" className="w-full justify-start hover:bg-blue-50">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>

                </div>
              </div>
              {/* Car Prices */}
              {packageData.carPrices && packageData.carPrices.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Car className="w-5 h-5 text-blue-600" />
                    Car Rental Prices
                  </h3>
                  <div className="space-y-3">
                    {packageData.carPrices.map((carPrice, index) => (
                      <div
                        key={carPrice.id || index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium text-gray-800 text-sm">{carPrice.carType}</span>
                        <span className="flex items-center gap-1 font-bold text-blue-600">
                          <IndianRupee className="w-4 h-4" />
                          {Number.parseInt(carPrice.price).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-3 text-center">
                      * Prices may vary based on season and availability
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                      <Phone className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      {/* <section className="bg-orange-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Why Choose Our Temple Tours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Safe & Secure</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Experienced guides and safe transportation for your spiritual journey
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Expert Guides</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Knowledgeable local temple guides with deep spiritual insights
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Flexible Timing</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Customizable tour schedules to match your preferences
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">24/7 Support</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Round the clock customer support for your peace of mind
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Why Choose Us Section */}
      {packageData.whyChooseUsItems && packageData.whyChooseUsItems.length > 0 && (
        <section className="bg-orange-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Why Choose Our Temple Tours</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packageData.whyChooseUsItems.map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-orange-600">{renderIcon(item.iconName)}</div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                    {item.description && <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}





      <Footer />
    </div>
  )
}

export default TemplePackagePage

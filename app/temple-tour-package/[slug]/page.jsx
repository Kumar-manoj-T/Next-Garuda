import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { notFound } from "next/navigation"
import { BookingForm } from "@/components/booking-form"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MapPin, Clock, Users, Star, Calendar, Phone, Mail, CheckCircle, XCircle, Camera, Mountain, Car, Utensils } from 'lucide-react'

async function getTemplePackage(slug) {
  try {
    const docRef = doc(db, "templePackages", slug)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  } catch (error) {
    console.error("Error fetching temple package:", error)
    return null
  }
}

export default async function TemplePackagePage({ params }) {
  const { slug } = params
  const packageData = await getTemplePackage(slug)

  if (!packageData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${packageData.mainImage || '/temple-tour-package.png'})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-orange-500 text-white hover:bg-orange-600">
                <Mountain className="w-4 h-4 mr-1" />
                Temple Tour
              </Badge>
              <Badge variant="outline" className="border-white text-white">
                <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                {packageData.rating || "4.8"}
              </Badge>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in-up delay-200">
              {packageData.title}
            </h1>
            
            <p className="text-xl lg:text-2xl mb-8 opacity-90 animate-fade-in-up delay-400">
              {packageData.shortDescription}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-lg animate-fade-in-up delay-600">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <span>{packageData.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-400" />
                <span>{packageData.groupSize || "Any Group Size"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span>{packageData.location}</span>
              </div>
            </div>
            
            <div className="mt-8 animate-fade-in-up delay-800">
              <div className="text-3xl font-bold text-orange-400">
                ₹{packageData.price}
                <span className="text-lg text-white/80 ml-2">per person</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Package Overview */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Mountain className="w-8 h-8 text-orange-500" />
                  Package Overview
                </h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: packageData.description }}
                />
              </CardContent>
            </Card>

            {/* Dynamic Sections */}
            {packageData.sections && packageData.sections.length > 0 && (
              <div className="space-y-8">
                {packageData.sections.map((section, index) => (
                  <Card 
                    key={section.id} 
                    className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className={index % 2 === 0 ? "order-1" : "order-2"}>
                          <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            {section.contentTitle}
                          </h3>
                          <div 
                            className="prose prose-lg text-gray-700 mb-6"
                            dangerouslySetInnerHTML={{ __html: section.contentDescription }}
                          />
                          {section.listInfo && section.listInfo.length > 0 && (
                            <ul className="space-y-3">
                              {section.listInfo.map((item) => (
                                <li key={item.id} className="flex items-start gap-3">
                                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">{item.text}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        {section.imageUrl && (
                          <div className={index % 2 === 0 ? "order-2" : "order-1"}>
                            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                              <img
                                src={section.imageUrl || "/placeholder.svg"}
                                alt={section.contentTitle}
                                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Gallery */}
            {packageData.galleryImages && packageData.galleryImages.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Camera className="w-8 h-8 text-orange-500" />
                    Photo Gallery
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {packageData.galleryImages.map((image, index) => (
                      <div 
                        key={index} 
                        className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer transform transition-all duration-300 hover:scale-105"
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Itinerary */}
            {packageData.itinerary && packageData.itinerary.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-orange-500" />
                    Detailed Itinerary
                  </h2>
                  <div className="space-y-6">
                    {packageData.itinerary.map((day, index) => (
                      <div key={day.id} className="relative">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                              {day.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              {day.description}
                            </p>
                          </div>
                        </div>
                        {index < packageData.itinerary.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-orange-300 to-red-300"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Inclusions */}
              {packageData.inclusions && packageData.inclusions.length > 0 && (
                <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 animate-fade-in-up">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <CheckCircle className="w-7 h-7 text-green-500" />
                      What's Included
                    </h3>
                    <ul className="space-y-3">
                      {packageData.inclusions.map((item) => (
                        <li key={item.id} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Exclusions */}
              {packageData.exclusions && packageData.exclusions.length > 0 && (
                <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-pink-50 animate-fade-in-up">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <XCircle className="w-7 h-7 text-red-500" />
                      What's Not Included
                    </h3>
                    <ul className="space-y-3">
                      {packageData.exclusions.map((item) => (
                        <li key={item.id} className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Terms & Conditions */}
            {packageData.termsConditions && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Terms & Conditions
                  </h2>
                  <div 
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: packageData.termsConditions }}
                  />
                </CardContent>
              </Card>
            )}

            {/* FAQs */}
            {packageData.faqs && packageData.faqs.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Frequently Asked Questions
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {packageData.faqs.map((faq, index) => (
                      <AccordionItem 
                        key={faq.id} 
                        value={`item-${index}`}
                        className="border border-gray-200 rounded-lg px-6 shadow-sm"
                      >
                        <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-orange-600 transition-colors">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 pt-2">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Booking Form */}
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in-up">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white rounded-t-lg">
                    <h3 className="text-2xl font-bold mb-2">Book This Package</h3>
                    <p className="opacity-90">Secure your spiritual journey today</p>
                  </div>
                  <div className="p-6">
                    <BookingForm />
                  </div>
                </CardContent>
              </Card>

              {/* Package Highlights */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50 animate-fade-in-up">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Package Highlights</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Duration</p>
                        <p className="text-sm text-gray-600">{packageData.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Location</p>
                        <p className="text-sm text-gray-600">{packageData.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Group Size</p>
                        <p className="text-sm text-gray-600">{packageData.groupSize || "Any Size"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Rating</p>
                        <p className="text-sm text-gray-600">{packageData.rating || "4.8"}/5 ⭐</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 animate-fade-in-up">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Call Us</p>
                        <p className="text-sm text-blue-600">+91 9876543210</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Email Us</p>
                        <p className="text-sm text-blue-600">info@templetours.com</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

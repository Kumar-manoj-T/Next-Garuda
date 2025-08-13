import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, Shirt, Star, ShieldCheck, Users, Clock, MapPin, Wallet, BriefcaseMedical, UserCheck, Award, Phone, Mail, MessageCircle, XCircle } from 'lucide-react' // Added new icons for Why Choose Us
import Header from "@/components/header"
import Footer from "@/components/footer"
import BookingForm from "@/components/booking-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Map icon names from CMS to Lucide React components
const IconMap = {
  Star: Star,
  ShieldCheck: ShieldCheck,
  Users: Users,
  Clock: Clock,
  MapPin: MapPin,
  Wallet: Wallet,
  BriefcaseMedical: BriefcaseMedical,
  UserCheck: UserCheck,
  Award: Award,
  Phone: Phone,
  Mail: Mail,
  MessageCircle: MessageCircle,
  // Add other icons here if needed in the future
}

// This is a Server Component, so it can directly fetch data
export default async function TirupatiPackageDetailPage({ params }) {
  const { slug } = params

  let packageData = null
  let error = null
  let otherPackages = []

  try {
    // Fetch current package data
    const docRef = doc(db, "tirupati-package", slug)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      packageData = { id: docSnap.id, ...docSnap.data() }

      // Fetch other packages (excluding the current one)
      const q = query(collection(db, "tirupati-package"), where("url", "!=", slug))
      const querySnapshot = await getDocs(q)
      otherPackages = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } else {
      error = "Package not found."
    }
  } catch (err) {
    console.error("Error fetching package or other packages:", err)
    error = "Failed to load package details. Please try again later."
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-lg text-gray-700">{error}</p>
        </div>
      </div>
    )
  }

  if (!packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
        <p className="text-lg text-gray-700">Loading package details...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          {packageData.images && packageData.images.length > 0 && (
            <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg mb-6">
              <Image
                src={packageData.images[0] || "/placeholder.svg?height=400&width=800&query=featured travel image"}
                alt={`${packageData.title} featured image`}
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
          <h1 className="text-5xl font-bold text-gray-800 mb-4">{packageData.title}</h1>
          {/* {packageData.subtitle && <p className="text-xl text-gray-600 mb-6">{packageData.subtitle}</p>}
          <Breadcrumb className="justify-center">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{packageData.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> */}
        </section>

        {/* Booking Form and Why Choose Us Section - Adjusted Layout */}
        <section className=" px-4 bg-gray-100 mb-10">
          <div className="container mx-auto flex flex-col gap-12 items-center">
            {/* Booking Form */}
            <div>
              <BookingForm />
            </div>

          
          </div>
        </section>

          {/* Custom "Why Choose Us" Section */}
            {packageData.whyChooseUsItems && packageData.whyChooseUsItems.length > 0 && (
              <div className="flex flex-col items-center w-full mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Why Choose Us</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {packageData.whyChooseUsItems?.map((item) => {
                    const IconComponent = IconMap[item.iconName]
                    if (!IconComponent) return null
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md border border-gray-200 transition-transform duration-200 hover:scale-[1.02]"
                      >
                        <div className="mb-4">
                          <IconComponent className="h-12 w-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                        {/* Description is intentionally removed as per user request */}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

        {/* Overview Section */}
        {packageData.content && (
          <section className="mb-12 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Overview</h2>
            <div
              className="prose max-w-none text-gray-700 mx-auto mb-6"
              dangerouslySetInnerHTML={{ __html: packageData.content }}
            />
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Call to Book Now
            </Button>
          </section>
        )}

      

        {packageData.carPrices && packageData.carPrices.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {packageData.title} Package Price Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {packageData.carPrices.map((car) => (
                <div key={car.id} className="bg-white rounded-xl shadow-md overflow-hidden border">
                  {/* Car Image */}
                  <div className="w-full h-48 relative">
                    <Image
                      src={car.imageUrl || "/placeholder.svg?height=200&width=300&query=Car for " + car.carName}
                      alt={car.carName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Car Name */}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">{car.carName}</h3>
                    {/* Price Table */}
                    <div className="border border-gray-200 rounded overflow-hidden">
                      {car.prices.map((price, priceIndex) => (
                        <div
                          key={price.value}
                          className={`grid grid-cols-2 py-3 px-4 border-b border-gray-200 last:border-0 ${priceIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }`}
                        >
                          <div className="font-medium text-gray-800">{price.label}</div>
                          <div className="text-lg font-bold text-blue-600 text-right">
                            ₹ {price.value.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Inclusions/Exclusions for this specific car */}
                    {(car.includes || car.excludes) && (
                      <div className="mt-4 space-y-2">
                        {car.includes && (
                          <div>
                            <p className="font-semibold text-gray-700">Includes:</p>
                            <ul className="list-none p-0 m-0 text-sm text-gray-600">
                              {car.includes
                                .split("\n")
                                .filter((item) => item.trim() !== "")
                                .map((item, index) => (
                                  <li key={index} className="flex items-center">

                                    <span className="whitespace-pre-wrap">{item.trim()}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                        {car.excludes && (
                          <div>
                            <h4 className="font-semibold text-gray-700">Excludes:</h4>
                            <ul className="list-none p-0 m-0 text-sm text-gray-600">
                              {car.excludes
                                .split("\n")
                                .filter((item) => item.trim() !== "")
                                .map((item, index) => (
                                  <li key={index} className="flex items-center">
                                    <XCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                                    <span className="whitespace-pre-wrap">{item.trim()}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-center mb-3">
                    <a
                      href="#booking"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

     {packageData.packagesAndCars && packageData.packagesAndCars.length > 0 && (
  <section className="mb-12">
    <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Packages & Cars</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {packageData.packagesAndCars.map((packageItem) => (
        <div
          key={packageItem.id}
          className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col"
        >
          {/* Package Name Header */}
          <div className="bg-blue-600 text-white text-center py-4 px-6">
            <h3 className="text-xl font-bold">{packageItem.packageName}</h3>
          </div>

          {/* Cars Table-like Structure */}
          {packageItem.cars && packageItem.cars.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-900">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Car Name</th>
                    <th className="px-4 py-2 font-semibold text-center">Seat</th>
                    <th className="px-4 py-2 font-semibold text-center">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {packageItem.cars.map((car) => (
                    <tr key={car.id}>
                      <td className="px-4 py-2">{car.carName}</td>
                      <td className="px-4 py-2 text-center">{car.seatCapacity}</td>
                      <td className="px-4 py-2 text-center text-blue-600 font-bold">
                        ₹ {car.price ?? 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-4 text-center text-gray-500">No cars available</p>
          )}

          {/* Book Now Button */}
          <div className="p-4 mt-auto">
            <a
              href="#booking"
              className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Book Now
            </a>
          </div>
        </div>
      ))}
    </div>
  </section>
)}

          {/* Additional Packages and Cars Section */}
          {(packageData.packages || packageData.cars || packageData.additionalPackages || packageData.carTypes) && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Available Packages & Cars</h2>
              
              {/* Display Packages if available */}
              {packageData.packages && packageData.packages.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Package Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packageData.packages.map((pkg) => (
                      <div key={pkg.id} className="bg-white rounded-lg shadow-md p-6 border">
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">{pkg.name || pkg.title}</h4>
                        {pkg.description && <p className="text-gray-600 mb-3">{pkg.description}</p>}
                        {pkg.price && (
                          <p className="text-lg font-bold text-blue-600 mb-2">₹ {pkg.price.toLocaleString()}</p>
                        )}
                        {pkg.duration && <p className="text-sm text-gray-500">Duration: {pkg.duration}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display Cars if available */}
              {packageData.cars && packageData.cars.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Available Cars</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packageData.cars.map((car) => (
                      <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden border">
                        {car.image && (
                          <div className="w-full h-48 relative">
                            <Image
                              src={car.image || "/placeholder.svg?height=200&width=300&query=Car"}
                              alt={car.name || "Car"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="text-xl font-semibold text-gray-800 mb-2">{car.name || car.type}</h4>
                          {car.description && <p className="text-gray-600 mb-3 text-sm">{car.description}</p>}
                          {car.capacity && <p className="text-sm text-gray-500 mb-1">Capacity: {car.capacity} persons</p>}
                          {car.price && (
                            <p className="text-lg font-bold text-blue-600">₹ {car.price.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display Additional Packages if available */}
              {packageData.additionalPackages && packageData.additionalPackages.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Additional Packages</h3>
                  <div className="space-y-4">
                    {packageData.additionalPackages.map((pkg) => (
                      <div key={pkg.id} className="bg-gray-50 rounded-lg p-6 border">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{pkg.name || pkg.title}</h4>
                        {pkg.description && (
                          <div 
                            className="text-gray-600 mb-3"
                            dangerouslySetInnerHTML={{ __html: pkg.description }}
                          />
                        )}
                        {pkg.features && pkg.features.length > 0 && (
                          <ul className="list-none space-y-1">
                            {pkg.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-gray-700">
                                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display Car Types if available */}
              {packageData.carTypes && packageData.carTypes.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Car Categories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {packageData.carTypes.map((carType) => (
                      <div key={carType.id} className="bg-white rounded-lg shadow-md p-6 border">
                        <h4 className="text-xl font-semibold text-gray-800 mb-3">{carType.name || carType.category}</h4>
                        {carType.description && <p className="text-gray-600 mb-4">{carType.description}</p>}
                        {carType.cars && carType.cars.length > 0 && (
                          <div>
                            <p className="font-medium text-gray-700 mb-2">Available Cars:</p>
                            <ul className="space-y-1">
                              {carType.cars.map((car, index) => (
                                <li key={index} className="text-gray-600 text-sm">• {car}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {carType.priceRange && (
                          <p className="text-lg font-bold text-blue-600 mt-3">
                            Price Range: ₹ {carType.priceRange}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}



        {/* Package Includes Section */}
        {packageData.includes && packageData.includes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">What's Included</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packageData.includes.map((item) => (
                <li key={item.id} className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Passenger Notes Section */}
        {packageData.passengerNotes && packageData.passengerNotes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Important Passenger Notes</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {packageData.passengerNotes.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Places We Cover Section */}
        {packageData.sightseeingPlaces && packageData.sightseeingPlaces.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Places We Cover in the Package</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packageData.sightseeingPlaces.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image
                      src={item.imageUrl || "/placeholder.svg?height=200&width=300&query=sightseeing place"}
                      alt={item.text}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-semibold text-gray-800">{item.text}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Itinerary & Dress Code Section */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Itinerary */}
          {packageData.itineraries && packageData.itineraries.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Itinerary ({packageData.days} Day{packageData.days > 1 ? "s" : ""})
              </h2>
              <ol className="space-y-4">
                {packageData.itineraries.map((item, index) => (
                  <li key={item.id} className="flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex-shrink-0 mr-3">
                      {index + 1}
                    </div>
                    <p className="text-lg text-gray-700">{item.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Dress Code */}
          {(packageData.maleDressCodeImages?.length > 0 || packageData.femaleDressCodeImages?.length > 0) && (
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Dress Code</h2>
              <div className="grid grid-cols-1 gap-8">
                {packageData.femaleDressCodeImages?.[0] && (
                  <Card className="overflow-hidden">
                    <CardHeader className="p-4 text-center">
                      <CardTitle className="text-xl font-semibold text-gray-800">Female</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="relative w-full h-64">
                        <Image
                          src={
                            packageData.femaleDressCodeImages[0] ||
                            "/placeholder.svg?height=300&width=200&query=female traditional dress"
                           || "/placeholder.svg"}
                          alt="Female dress code example"
                          fill
                          style={{ objectFit: "cover" }}
                          className="transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
                {packageData.maleDressCodeImages?.[0] && (
                  <Card className="overflow-hidden">
                    <CardHeader className="p-4 text-center">
                      <CardTitle className="text-xl font-semibold text-gray-800">Male</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="relative w-full h-64">
                        <Image
                          src={
                            packageData.maleDressCodeImages[0] ||
                            "/placeholder.svg?height=300&width=200&query=male traditional dress"
                           || "/placeholder.svg"}
                          alt="Male dress code example"
                          fill
                          style={{ objectFit: "cover" }}
                          className="transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Dynamic Sections */}
        {packageData.sections && packageData.sections.length > 0 && (
          <section className="mb-12 space-y-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">More Details</h2>
            {packageData.sections.map((section) => (
              <div key={section.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {section.imageUrl && (
                  <div className="relative w-full h-72 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={section.imageUrl || "/placeholder.svg?height=300&width=500&query=section image"}
                      alt={section.contentTitle || "Section image"}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div>
                  {section.contentTitle && (
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{section.contentTitle}</h3>
                  )}
                  {section.contentDescription && (
                    <div
                      className="prose max-w-none text-gray-700 mb-4"
                      dangerouslySetInnerHTML={{ __html: section.contentDescription }}
                    />
                  )}
                  {section.listInfo && section.listInfo.length > 0 && (
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {section.listInfo.map((item) => (
                        <li key={item.id}>{item.text}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Additional Packages Section */}
        {otherPackages.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Other Packages You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative w-full h-48">
                      <Image
                        src={pkg.images?.[0] || "/images/city/free.png?height=200&width=300&query=other package image"}
                        alt={pkg.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{pkg.title}</CardTitle>
                    {pkg.subtitle && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{pkg.subtitle}</p>}
                    {pkg.carPrices?.[0]?.prices?.[0]?.value && (
                      <p className="text-lg font-bold text-blue-600 mb-4">
                        Starting from {pkg.carPrices[0].prices[0].value}
                      </p>
                    )}
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Link href={`/tirupati-package/${pkg.url}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* FAQs Section */}
        {packageData.faqs && packageData.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {packageData.faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

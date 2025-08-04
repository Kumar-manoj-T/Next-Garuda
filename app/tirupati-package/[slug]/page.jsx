import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Check,
  Shirt,
  Star,
  ShieldCheck,
  Users,
  Clock,
  MapPin,
  Wallet,
  BriefcaseMedical,
  UserCheck,
  Award,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react" // Added new icons for Why Choose Us
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
        <section className="py-12 px-4 bg-gray-100 mb-10">
          <div className="container mx-auto flex flex-col gap-12 items-center">
            {/* Booking Form */}
            <div >
              <BookingForm />
            </div>

            {/* Custom "Why Choose Us" Section */}
            {packageData.whyChooseUsItems && packageData.whyChooseUsItems.length > 0 && (
              <div className="flex flex-col items-center w-full">
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
          </div>
        </section>

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
        <div
          key={car.id}
          className="bg-white rounded-xl shadow-md overflow-hidden border"
        >
          {/* Car Image */}
          <div className="w-full h-48 relative">
            <Image
              src={car.imageUrl || "/placeholder.svg?height=200&width=300"}
              alt={car.carName}
              fill
              className="object-cover"
            />
          </div>

          {/* Car Name */}
          <div className="p-4">
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
              {car.carName}
            </h3>

            {/* Price Table */}
            <table className="w-full text-sm text-left border border-gray-200 rounded">
              <tbody>
                {car.prices.map((price) => (
                  <tr key={price.id} className="border-b last:border-0">
                    <td className="px-4 py-2 font-medium bg-gray-100">{price.label}</td>
                    <td className="px-4 py-2 text-blue-500 font-semibold">₹ {price.value.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Inclusions Note */}
            <p className="text-center text-gray-600 text-sm mt-4">
              Driver beta, permit, toll gate fees, parking fees are included.
            </p>
          </div>
        </div>
      ))}
    </div>
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
                          }
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
                          }
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
                        src={pkg.images?.[0] || "/placeholder.svg?height=200&width=300&query=other package image"}
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

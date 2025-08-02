import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, MapPin } from "lucide-react" // Import MapPin for sightseeing places
import Header from "@/components/header"
import Footer from "@/components/footer"

// This is a Server Component, so it can directly fetch data
export default async function TirupatiPackageDetailPage({ params }) {
  const { slug } = params // The slug from the URL will be the Firestore document ID

  let packageData = null
  let error = null

  try {
    const docRef = doc(db, "tirupati-package", slug)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      packageData = { id: docSnap.id, ...docSnap.data() }
    } else {
      error = "Package not found."
    }
  } catch (err) {
    console.error("Error fetching package:", err)
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
    // This case should ideally be caught by the error block if docSnap.exists() is false
    // but as a fallback for initial render or unexpected states.
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
        <p className="text-lg text-gray-700">Loading package details...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* You might want to include your Header and Footer components here or in a layout.tsx */}
      <Header />

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-gray-800 text-center mb-6">{packageData.title}</h1>
        {packageData.subtitle && <p className="text-xl text-gray-600 text-center mb-8">{packageData.subtitle}</p>}

        {/* Image Gallery */}
        {packageData.images && packageData.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {packageData.images.map((imgSrc, index) => (
              <div key={index} className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={imgSrc || "/placeholder.svg"}
                  alt={`${packageData.title} image ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}

        {/* Main Content/Description */}
        {packageData.content && (
          <div
            className="prose max-w-none text-gray-700 mb-12"
            dangerouslySetInnerHTML={{ __html: packageData.content }}
          />
        )}

        {/* Packages and Cars Section */}
        {packageData.packagesAndCars && packageData.packagesAndCars.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Packages & Car Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packageData.packagesAndCars.map((item) => (
                <div key={item.id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">{item.packageName}</h3>
                  <p className="text-gray-700 mb-2">
                    Car Type: <span className="font-medium">{item.carType}</span>
                  </p>
                  <p className="text-2xl font-bold text-green-600">{item.price}</p>
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

        {/* Package Itinerary Section */}
        {packageData.itineraries && packageData.itineraries.length > 0 && (
          <section className="mb-12">
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

        {/* Sightseeing Places Section */}
        {packageData.sightseeingPlaces && packageData.sightseeingPlaces.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Sightseeing Places</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
              {packageData.sightseeingPlaces.map((item) => (
                <li key={item.id} className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Car Prices Section */}
        {packageData.carPrices && packageData.carPrices.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Car Rental Prices</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Car Name</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">R.Pe Price</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">TELAN Price</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">BANG Price</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">PONDI Price</th>
                  </tr>
                </thead>
                <tbody>
                  {packageData.carPrices.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="py-3 px-4 border-b text-gray-800 font-medium">{item.carName}</td>
                      <td className="py-3 px-4 border-b text-gray-700">{item.rpPrice}</td>
                      <td className="py-3 px-4 border-b text-gray-700">{item.telanPrice}</td>
                      <td className="py-3 px-4 border-b text-gray-700">{item.bangPrice}</td>
                      <td className="py-3 px-4 border-b text-gray-700">{item.pondiPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Dynamic Sections */}
        {packageData.sections && packageData.sections.length > 0 && (
          <section className="mb-12">
            {packageData.sections.map((section) => (
              <div key={section.id} className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{section.title}</h2>
                <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            ))}
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

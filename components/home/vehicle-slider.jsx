"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const initialVehicleImages = [
  { id: 1, src: "/placeholder.svg?height=300&width=450", alt: "Vehicle 1" },
  { id: 2, src: "/placeholder.svg?height=300&width=450", alt: "Vehicle 2" },
  { id: 3, src: "/placeholder.svg?height=300&width=450", alt: "Vehicle 3" },
  { id: 4, src: "/placeholder.svg?height=300&width=450", alt: "Vehicle 4" },
  { id: 5, src: "/placeholder.svg?height=300&width=450", alt: "Vehicle 5" },
  { id: 6, src: "/placeholder.svg?height=300&width=450", alt: "Vehicle 6" },
  { id: 7, src: "/placeholder.svg?height=300&width=450", alt: "Vehicle 7" },
  { id: 8, src: "/placeholder.svg?height=300&width=450", alt: "Vehicle 8 (Special)" },
]

const initialWhyChooseUsItems = [
  { id: 1, src: "/placeholder.svg?height=64&width=64", title: "24/7 Support" },
  { id: 2, src: "/placeholder.svg?height=64&width=64", title: "Clean Vehicles" },
  { id: 3, src: "/placeholder.svg?height=64&width=64", title: "Experienced Drivers" },
  { id: 4, src: "/placeholder.svg?height=64&width=64", title: "Affordable Prices" },
]

export default function VehicleFeatures() {
  const [visibleVehicles, setVisibleVehicles] = useState(initialVehicleImages)
  const [visibleWhyUsItems, setVisibleWhyUsItems] = useState(initialWhyChooseUsItems)

  // Vehicle Carousel loop
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleVehicles((prev) => {
        const [first, ...rest] = prev
        return [...rest, first]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Why Choose Us loop
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleWhyUsItems((prev) => {
        const [first, ...rest] = prev
        return [...rest, first]
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-12 px-4 bg-white">
  <div className="container mx-auto">
    <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
      Why Choose Us & Our Fleet
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 items-center">
      {/* Left Column: Vehicles Slider */}
      <div className="lg:col-span-4 bg-gray-100 p-6 rounded-lg shadow-lg overflow-hidden h-[300px] md:h-[400px] lg:h-[450px]">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center lg:text-left">
          Our Fleet
        </h3>
        <div className="flex overflow-x-auto gap-4 hide-scrollbar scroll-smooth">
          {visibleVehicles.map((image, index) => (
            <div
              key={`${image.id}-${index}`}
              className="flex-shrink-0 w-64 snap-center mr-2 last:mr-0 transition-all duration-300"
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                width={450}
                height={300}
                className="rounded-lg object-cover w-full h-auto"
              />
              <p className="text-center text-gray-700 mt-2">{image.alt}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Why Choose Us Slider */}
      <div className="lg:col-span-2 bg-gray-100 p-6 rounded-lg shadow-lg h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden flex flex-col justify-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Why Choose Us</h3>
        <div className="flex flex-col items-center overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar h-full">
          {visibleWhyUsItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex-shrink-0 flex flex-col items-center justify-center snap-center mb-0 last:mb-0"
            >
              <Image
                src={item.src || "/placeholder.svg"}
                alt={item.title}
                width={64}
                height={64}
                className="rounded-full object-cover mb-2 border-2 border-blue-500"
              />
              <p className="text-gray-700 font-medium text-center whitespace-nowrap">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>

  {/* Hide Scrollbar */}
  <style jsx>{`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
</section>

  )
}

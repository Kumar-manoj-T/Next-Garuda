"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const packagesData = {
  "Tirupati Package": [
    {
      id: 1,
      name: "Tirupati Darshan (Standard)",
      price: "$150",
      description: "A comfortable tour to Tirupati, including darshan and basic amenities.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Tirupati Darshan (Deluxe)",
      price: "$250",
      description: "Enhanced Tirupati experience with premium accommodation and services.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Tirupati Darshan (Premium)",
      price: "$400",
      description: "Luxury Tirupati tour with VIP darshan and exclusive facilities.",
      image: "/placeholder.svg?height=200&width=300",
    },
  ],
  "Temple Tour Package": [
    {
      id: 4,
      name: "South India Temple Tour",
      price: "$500",
      description: "Explore ancient temples across South India with expert guides.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      name: "North India Temple Tour",
      price: "$650",
      description: "Discover the spiritual heritage of North India's iconic temples.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      name: "Custom Temple Tour",
      price: "Custom",
      description: "Design your own spiritual journey to temples of your choice.",
      image: "/placeholder.svg?height=200&width=300",
    },
  ],
  "Car Rental Package": [
    {
      id: 7,
      name: "Sedan Rental (Daily)",
      price: "$80/day",
      description: "Rent a comfortable sedan for your daily travel needs.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 8,
      name: "SUV Rental (Weekly)",
      price: "$500/week",
      description: "Spacious SUV for family trips or longer journeys.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 9,
      name: "Van Rental (Group)",
      price: "$120/day",
      description: "Ideal for group travel, offering ample space and comfort.",
      image: "/placeholder.svg?height=200&width=300",
    },
  ],
}

export default function TourPackages() {
  const [activeCategory, setActiveCategory] = useState("Tirupati Package")

  const currentPackages = packagesData[activeCategory] || []

  return (
    <section className="py-12 px-4 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Our Tour Packages</h2>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.keys(packagesData).map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 text-lg rounded-full transition-all duration-200 ${
                activeCategory === category
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative w-full h-48">
                <Image
                  src={pkg.image || "/placeholder.svg"}
                  alt={pkg.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{pkg.name}</h3>
                <p className="text-blue-600 text-xl font-bold mb-4">{pkg.price}</p>
                <p className="text-gray-600 mb-6">{pkg.description}</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">Book Now</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

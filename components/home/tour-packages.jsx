"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const packagesData = {
  "Tirupati Package": [
    {
      id: 1,
      name: "Chennai to Tirupati ",
      price: "$150",
      include: "Home Pickup & Drop, Breakfast & Lunch, Special Entry Darshan Ticket, SriVari Laddu per person.",
      exclude: "Accommodation not provided, Multiple pickups, Guide fees excluded, Extra Laddus.",
      image: "/images/c-t.png",
    },
    {
      id: 2,
      name: "Vellore to Tirupati",
      price: "$250",
      include: "Home Pickup & Drop, Breakfast & Lunch, Special Entry Darshan Ticket, SriVari Laddu per person",
      exclude: "Accommodation not provided, Multiple pickups, Guide fees excluded, Extra Laddu",
      image: "/images/v-t.png",
    },
    {
      id: 3,
      name: "Bangalore to Tirupati",
      price: "$400",
      include: "Home Pickup & Drop, Breakfast & Lunch, Special Entry Darshan Ticket, SriVari Laddu per person.",
      exclude: "Accommodation not provided, Multiple pickups, Guide fees excluded, Extra Laddu",
      image: "/images/b-t.png",
    },
  ],
  // "Temple Tour Package": [
  //   {
  //     id: 4,
  //     name: "South India Temple Tour",
  //     price: "$500",
  //     description: "Explore ancient temples across South India with expert guides.",
  //     image: "/placeholder.svg?height=200&width=300",
  //   },
  //   {
  //     id: 5,
  //     name: "North India Temple Tour",
  //     price: "$650",
  //     description: "Discover the spiritual heritage of North India's iconic temples.",
  //     image: "/placeholder.svg?height=200&width=300",
  //   },
  //   {
  //     id: 6,
  //     name: "Custom Temple Tour",
  //     price: "Custom",
  //     description: "Design your own spiritual journey to temples of your choice.",
  //     image: "/placeholder.svg?height=200&width=300",
  //   },
  // ],
  // "Car Rental Package": [
  //   {
  //     id: 7,
  //     name: "Sedan Rental (Daily)",
  //     price: "$80/day",
  //     description: "Rent a comfortable sedan for your daily travel needs.",
  //     image: "/placeholder.svg?height=200&width=300",
  //   },
  //   {
  //     id: 8,
  //     name: "SUV Rental (Weekly)",
  //     price: "$500/week",
  //     description: "Spacious SUV for family trips or longer journeys.",
  //     image: "/placeholder.svg?height=200&width=300",
  //   },
  //   {
  //     id: 9,
  //     name: "Van Rental (Group)",
  //     price: "$120/day",
  //     description: "Ideal for group travel, offering ample space and comfort.",
  //     image: "/placeholder.svg?height=200&width=300",
  //   },
  // ],
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
              <div className="relative w-full h-64">
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
                {/* <p className="text-blue-600 text-xl font-bold mb-4">{pkg.price}</p> */}
                <small className="text-green-600 mb-6">*Include::{pkg.include}</small><br />
                <small className="text-red-600 mb-6">*Exclude::{pkg.exclude}</small>
               <a href="#booking"><Button  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">Book Now</Button></a> 
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import Image from "next/image"
import { Check, X } from "lucide-react"

const vehiclePermits = [
  {
    id: 1,
    image: "/placeholder.svg?height=100&width=150",
    title: "Swift/Etios",
    details: [
      { label: "R.Pe", value: "₹ 2500" },
      { label: "TELAN", value: "₹ 3000" },
      { label: "BANG", value: "₹ 3500" },
      { label: "PONDI", value: "₹ 2800" },
    ],
  },
  {
    id: 2,
    image: "/placeholder.svg?height=100&width=150",
    title: "SUV (Innova/Ertiga)",
    details: [
      { label: "R.Pe", value: "₹ 4000" },
      { label: "TELAN", value: "₹ 4500" },
      { label: "BANG", value: "₹ 5000" },
      { label: "PONDI", value: "₹ 4200" },
    ],
  },
  {
    id: 3,
    image: "/placeholder.svg?height=100&width=150",
    title: "Van (Tempo Traveller)",
    details: [
      { label: "R.Pe", value: "₹ 6000" },
      { label: "TELAN", value: "₹ 6500" },
      { label: "BANG", value: "₹ 7000" },
      { label: "PONDI", value: "₹ 6200" },
    ],
  },
  {
    id: 4,
    image: "/placeholder.svg?height=100&width=150",
    title: "Luxury Sedan",
    details: [
      { label: "R.Pe", value: "₹ 5500" },
      { label: "TELAN", value: "₹ 6000" },
      { label: "BANG", value: "₹ 6500" },
      { label: "PONDI", value: "₹ 5800" },
    ],
  },
]

const includedItems = ["Driver Allowance", "Fuel Charges", "Vehicle Maintenance", "Basic Insurance"]

const excludedItems = ["Toll Gate Fees", "Parking Charges", "Inter-state Permit Fees", "Personal Expenses"]

export default function PermitFeeSection() {
  return (
    <section className="py-16 px-4 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Standard Permit Fee for Our Vehicles</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* First Row */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vehicle Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Image
                src={vehiclePermits[0].image || "/placeholder.svg"}
                alt={vehiclePermits[0].title}
                width={150}
                height={100}
                className="rounded-md object-cover flex-shrink-0"
              />
              <div className="text-center sm:text-left w-full">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{vehiclePermits[0].title}</h3>
                <ul className="space-y-1 text-gray-600">
                  {vehiclePermits[0].details.map((detail, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{detail.label}:</span> {detail.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Vehicle Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Image
                src={vehiclePermits[1].image || "/placeholder.svg"}
                alt={vehiclePermits[1].title}
                width={150}
                height={100}
                className="rounded-md object-cover flex-shrink-0"
              />
              <div className="text-center sm:text-left w-full">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{vehiclePermits[1].title}</h3>
                <ul className="space-y-1 text-gray-600">
                  {vehiclePermits[1].details.map((detail, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{detail.label}:</span> {detail.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Included Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">INCLUDED</h3>
            <ul className="space-y-2">
              {includedItems.map((item, idx) => (
                <li key={idx} className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Second Row */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vehicle Card 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Image
                src={vehiclePermits[2].image || "/placeholder.svg"}
                alt={vehiclePermits[2].title}
                width={150}
                height={100}
                className="rounded-md object-cover flex-shrink-0"
              />
              <div className="text-center sm:text-left w-full">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{vehiclePermits[2].title}</h3>
                <ul className="space-y-1 text-gray-600">
                  {vehiclePermits[2].details.map((detail, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{detail.label}:</span> {detail.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Vehicle Card 4 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Image
                src={vehiclePermits[3].image || "/placeholder.svg"}
                alt={vehiclePermits[3].title}
                width={150}
                height={100}
                className="rounded-md object-cover flex-shrink-0"
              />
              <div className="text-center sm:text-left w-full">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{vehiclePermits[3].title}</h3>
                <ul className="space-y-1 text-gray-600">
                  {vehiclePermits[3].details.map((detail, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{detail.label}:</span> {detail.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Excluded Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">EXCLUDED</h3>
            <ul className="space-y-2">
              {excludedItems.map((item, idx) => (
                <li key={idx} className="flex items-center text-gray-700">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

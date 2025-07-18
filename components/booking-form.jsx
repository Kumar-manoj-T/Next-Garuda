"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function BookingForm() {
  const [selectedPackage, setSelectedPackage] = useState("Tirupati Package") // Default selected package

  const handlePackageChange = (event) => {
    setSelectedPackage(event.target.value)
  }

  return (
    <>
     <section className="py-12 px-4 bg-gray-100 flex flex-col items-center justify-center min-h-screen">
      {/* Package Selection Radio Buttons - Separated Box */}
     





      {/* Main Booking Form */}
        <div className="form">
          <div className="w-full max-w-2xl mb-0 ms-0">
  <div className="flex gap-4">
    {/* Tirupati Package */}
    <label
      className={`flex-1   bg-white font-light px-4 py-3 text-center cursor-pointer transition-colors duration-200 ease-in-out ${
        selectedPackage === "Tirupati Package"
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-700 hover:bg-gray-100"
      }`}
    >
      <input
        type="radio"
        name="packageType"
        value="Tirupati Package"
        checked={selectedPackage === "Tirupati Package"}
        onChange={handlePackageChange}
        className="sr-only"
      />
      Tirupati Package
    </label>

    {/* Car Rental Package */}
    <label
      className={`flex-1     bg-white font-light px-4 py-3 text-center cursor-pointer transition-colors duration-200 ease-in-out ${
        selectedPackage === "Car Rental Package"
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-700 hover:bg-gray-100"
      }`}
    >
      <input
        type="radio"
        name="packageType"
        value="Car Rental Package"
        checked={selectedPackage === "Car Rental Package"}
        onChange={handlePackageChange}
        className="sr-only"
      />
      Car Rental Package
    </label>

    {/* Temple Tour Package */}
    <label
      className={`flex-1   border-b-0   bg-white font-light px-4 py-3 text-center cursor-pointer transition-colors duration-200 ease-in-out ${
        selectedPackage === "Temple Tour Package"
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-700 hover:bg-gray-100"
      }`}
    >
      <input
        type="radio"
        name="packageType"
        value="Temple Tour Package"
        checked={selectedPackage === "Temple Tour Package"}
        onChange={handlePackageChange}
        className="sr-only"
      />
      Temple Tour Package
    </label>
  </div>
</div>
          <div className="bg-white p-8 border-t-0 shadow-lg max-w-4xl mt-0 w-full">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Book Now</h2>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Row 1 */}
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Row 2 */}
              <div>
                <input
                  type="number"
                  placeholder="No. of Persons"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="dd-mm-yyyy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="-- : --"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Conditional Dropdowns */}
              {selectedPackage === "Car Rental Package" && (
                <div className="md:col-span-1">
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500">
                    <option>Swift/Etios</option>
                    <option>Sedan</option>
                    <option>SUV</option>
                    <option>Van</option>
                  </select>
                </div>
              )}

              {(selectedPackage === "Tirupati Package" || selectedPackage === "Temple Tour Package") && (
                <div className="md:col-span-1">
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500">
                    <option>-- Select a Package --</option>
                    {selectedPackage === "Tirupati Package" && (
                      <>
                        <option>Tirupati Darshan (Standard)</option>
                        <option>Tirupati Darshan (Deluxe)</option>
                        <option>Tirupati Darshan (Premium)</option>
                      </>
                    )}
                    {selectedPackage === "Temple Tour Package" && (
                      <>
                        <option>South India Temple Tour</option>
                        <option>North India Temple Tour</option>
                        <option>Custom Temple Tour</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              {/* Your Message */}
              <div className="md:col-span-3">
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-3 flex justify-center mt-4">
                <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      
    </section>
    </>
   
  )
}


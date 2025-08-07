"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function BookingForm() {
  const [selectedPackage, setSelectedPackage] = useState("Tirupati Package")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    persons: "",
    date: "",
    time: "",
    selectedOption: "",
    message: "",
  })

  const handlePackageChange = (event) => {
    setSelectedPackage(event.target.value)
    // Reset selected option when package changes
    setFormData((prev) => ({ ...prev, selectedOption: "" }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch("/api/submit-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          packageType: selectedPackage,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus({ type: "success", message: result.message })
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          persons: "",
          date: "",
          time: "",
          selectedOption: "",
          message: "",
        })
        setSelectedPackage("Tirupati Package")
      } else {
        setSubmitStatus({ type: "error", message: result.message })
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <section className="py-12 px-4 bg-gray-100 flex flex-col items-center justify-center min-h-screen" id="booking">
        {/* <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            {" "}
            Book Your Chennai to Tirupati Package with Garuda
          </h2>
          <p className="text-lg text-center text-gray-600 mb-12">
            Experience peace & devotion with our Chennai to Tirupati travel package, VIP darshan and flexible one‑day &
            two‑day packages.
          </p>
        </div> */}

        {/* Status Messages */}
        {submitStatus && (
          <div
            className={`max-w-4xl w-full mb-6 p-4 rounded-md ${submitStatus.type === "success"
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
              }`}
          >
            {submitStatus.message}
          </div>
        )}

        {/* Main Booking Form */}
        <div className="form">
          <div className="w-full max-w-2xl mb-0 ms-0">
            <div className="flex gap-4">
              {/* Tirupati Package */}
              <label
                className={`flex-1   bg-white font-light px-4 py-3 text-center cursor-pointer transition-colors duration-200 ease-in-out ${selectedPackage === "Tirupati Package"
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
                className={`flex-1     bg-white font-light px-4 py-3 text-center cursor-pointer transition-colors duration-200 ease-in-out ${selectedPackage === "Car Rental Package"
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
                className={`flex-1   border-b-0   bg-white font-light px-4 py-3 text-center cursor-pointer transition-colors duration-200 ease-in-out ${selectedPackage === "Temple Tour Package"
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
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Row 1 */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Row 2 */}
              <div>
                <input
                  type="number"
                  name="persons"
                  value={formData.persons}
                  onChange={handleInputChange}
                  placeholder="No. of Persons"
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />

              </div>
              <div className="relative">
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
              </div>

              {/* Conditional Dropdowns */}
              {selectedPackage === "Car Rental Package" && (
                <div className="md:col-span-1">
                  <select
                    name="selectedOption"
                    value={formData.selectedOption}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                  >
                    <option value="">Km Based Rental</option>
                    {/* <option value="Swift/Etios">Swift/Etios</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Van">Van</option> */}
                  </select>
                </div>
              )}

              {(selectedPackage === "Tirupati Package" || selectedPackage === "Temple Tour Package") && (
                <div className="md:col-span-1">
                  <select
                    name="selectedOption"
                    value={formData.selectedOption}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                  >
                    <option value="">-- Select a Package --</option>
                    {selectedPackage === "Tirupati Package" && (
                      <>
                        <option value="Tirumala Tirupati Darshan Package">Tirumala Tirupati Darshan Package </option>
                        <option value="Chennai to Tirupati One Day Tour">Chennai to Tirupati One Day Tour</option>
                        <option value="Chennai to Tirupati Two Days Tour">Chennai to Tirupati Two Days Tour</option>
                        <option value="VIP Break Darshan">VIP Break Darshan </option>
                        <option value="Bangalore to Tirupati Dharshan Tour">Bangalore to Tirupati Dharshan Tour</option>
                        <option value="Kanchipuram to Tirupati One Day Tour">Kanchipuram to Tirupati One Day Tour</option>
                        <option value="Kanchipuram to Tirupati Two Days Tour">Kanchipuram to Tirupati Two Days Tour</option>
                        <option value="Vellore to Tirupati One Day Tour">Vellore to Tirupati One Day Tour</option>
                        <option value="Vellore to Tirupati Two Days Tour">Vellore to Tirupati Two Days Tour</option>

                      </>
                    )}
                    {/* {selectedPackage === "Temple Tour Package" && (
                      <>
                        <option value="South India Temple Tour">South India Temple Tour</option>
                        <option value="North India Temple Tour">North India Temple Tour</option>
                        <option value="Custom Temple Tour">Custom Temple Tour</option>
                      </>
                    )} */}

                    {selectedPackage === "Temple Tour Package" && (
                      <>
                        <option value="Chennai-Kanchipuram Elruvanamalai Temple Package">
                          Chennai-Kanchipuram Elruvanamalai Temple Package
                        </option>
                        <option value="Chennai-Navagraha Temple Package">
                          Chennai-Navagraha Temple Package
                        </option>
                        <option value="Chennai-Trichy, Rameswaram, Madurai Temple Package">
                          Chennai-Trichy, Rameswaram, Madurai Temple Package
                        </option>
                        <option value="Chennai-Trichy, Madurai, Tiruchendur, Kanyakumari Temple Package">
                          Chennai-Trichy, Madurai, Tiruchendur, Kanyakumari Temple Package
                        </option>
                        <option value="Chennai-Srisolltom Mollis Arjuna Temple Package">
                          Chennai-Srisolltom Mollis Arjuna Temple Package
                        </option>
                        <option value="Chennai To Kodaikanal-Palani Temple Package">
                          Chennai To Kodaikanal-Palani Temple Package
                        </option>
                        <option value="Chennai-Kanchipuram, Mahabalipuram & Pondicherry Temple Package">
                          Chennai-Kanchipuram, Mahabalipuram & Pondicherry Temple Package
                        </option>
                        <option value="Chennai To Kalahasti Tour Package">
                          Chennai To Kalahasti Tour Package
                        </option>
                        <option value="Chennai-Vellore Temple Package">
                          Chennai-Vellore Temple Package
                        </option>
                        <option value="Chennai - Tiruvannamalai Temple Package">
                          Chennai - Tiruvannamalai Temple Package
                        </option>
                      </>
                    )}

                  </select>
                </div>
              )}

              {/* Your Message */}
              <div className="md:col-span-3">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-3 flex justify-center mt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

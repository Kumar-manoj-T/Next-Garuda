"use client"

import BookingForm from "@/components/booking-form"
import PermitFeeSection from "@/components/permit-fee"
import VehiclePricing from "@/components/vehicle-price"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"


function CarRentalPage() {
    return (



        <div className="min-h-screen bg-white">
            <Header />
            <section className="bg-red-100 py-12">
                <div className="container mx-auto text-center">
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                        Kelomeater Based Car Rental Service
                    </h1>

                    {/* Breadcrumb */}
                    <nav className="text-sm text-gray-600 flex justify-center items-center gap-2" aria-label="Breadcrumb">
                        <Link href="/" className="hover:underline text-gray-700 font-medium">
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 font-medium">Vehicle Pricing</span>
                    </nav>
                </div>
            </section>

            <section className="py-12 px-4 bg-white">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center ">
                    {/* Left - */}
                    <div className="w-full">
                        <img
                            src="/images/6.png"
                            alt="Car Booking"
                            className="rounded-lg shadow-lg w-full h-auto object-cover"
                        />
                    </div>

                    {/* Right -  Content */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-gray-800">Chennai to Tirupati One-Day Package – Quick & Devotional</h2>
                        <p className="text-gray-600">
                            Looking for a seamless Chennai to Tirupati one day package? Garuda Tours and Travels offers a complete one day package from Chennai to Tirupati with doorstep pickup, AC cab, breakfast, and VIP darshan. Perfect for families and solo pilgrims alike, this Tirupati package from Chennai lets you experience the blessings of Lord Venkateswara and return home the same day—without stress or long queues.
                        </p>
                        <p className="text-gray-600">
                            With our expert coordination, your Chennai to Tirupati travel package becomes more than a trip—it becomes a spiritual journey. Book now and travel in comfort while we take care of your darshan timing, travel schedule, and support throughout.
                        </p>
                        <a href="#booking">
                            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all">
                                Book One-Day Trip
                            </button>
                        </a>
                    </div>
                </div>
            </section>
            <VehiclePricing />
            <BookingForm />
            <PermitFeeSection />
            <Footer />
        </div>
    )
}

export default CarRentalPage
"use client"

import HeroSlider from "@/components/home/hero-slider"
import BookingForm from "@/components/booking-form"
import TourPackages from "@/components/home/tour-packages"
import Vehicl from "@/components/home/vehicle-slider"
import PassengerNoteBox from "@/components/PassengerNoteBox"
import Counter from "@/components/stats-counter"
import CustomerReviews from "@/components/customer-reviews"




export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      <HeroSlider />
      <BookingForm />
      <TourPackages />
      <Vehicl />
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center ">
          {/* Left - Content*/}
           <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800"> About Us</h2>
            <p className="text-gray-600">
              Looking for a seamless Chennai to Tirupati one day package? Garuda Tours and Travels offers a complete one day package from Chennai to Tirupati with doorstep pickup, AC cab, breakfast, and VIP darshan. Perfect for families and solo pilgrims alike, this Tirupati package from Chennai lets you experience the blessings of Lord Venkateswara and return home the same day—without stress or long queues.
With our expert coordination, your Chennai to Tirupati travel package becomes more than a trip—it becomes a spiritual journey. Book now and travel in comfort while we take care of your darshan timing, travel schedule, and support throughout.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all">
              Book Now
            </button>
          </div>
          {/* Right - Image */}
         <div className="w-[400px] h-[400px]">
            <img
              src="/images/about.png"
              alt="Car Booking"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

     <PassengerNoteBox />
     <section className="py-12 px-4 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center ">
          {/* Left - */}
           <div className="w-full">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Car Booking"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
           
          {/* Right -  Content */}
        <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Plan Your Journey</h2>
            <p className="text-gray-600">
              Book your ride with Garuda Tours and Travels. Enjoy comfortable, safe, and affordable
              travel across Tamil Nadu and beyond.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all">
              Book Now
            </button>
          </div>
        </div>
      </section>
      <CustomerReviews />
      <Counter/>
    </div>
  )
}

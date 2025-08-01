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
              Welcome to Garuda Tours and Travels, your trusted partner for hassle-free Chennai to Tirupati tour packages. We are specialists in providing well-organized Chennai to Tirupati one-day packages, two-day Tirupati tour packages, and VIP darshan packages from Chennai with on-time service, expert guidance, and comfortable travel. Our Tirupati darshan packages from Chennai are designed for individuals, families, and senior citizens seeking peace, devotion, and convenience. In addition to Tirupati, we offer divine temple tour packages to Rameswaram, Kanchipuram, Thiruvannamalai, and other holy destinations across South India. Every Chennai to Tirupati travel package is backed by our commitment to punctuality and customer satisfaction. Trusted by thousands of devotees, we aim to make your Tirupati package from Chennai truly spiritual, memorable, and easy to book.
            </p>
            <a href="#" className="inline-block">
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all">
                Learn More About Us
              </button>
            </a>
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
          <div className="w-[400px] h-[400px]">
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

      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center ">
          {/* Left - Content*/}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Chennai to Tirupati Two-Day Package – Peaceful Pilgrimage</h2>
            <p className="text-gray-600">
             Our Chennai to Tirupati two day package is ideal for those who prefer an unhurried, relaxed darshan experience. This two day package from Chennai to Tirupati includes comfortable accommodation, VIP darshan, and guided visits to nearby temples like Padmavathi Thayar Temple, all arranged with precision by Garuda Tours and Travels.
            </p>
            <p className="text-gray-600">
              This Tirupati tour package from Chennai gives you the time and flexibility to truly connect spiritually without rushing. It’s the perfect blend of devotion, comfort, and planning—trusted by thousands of pilgrims.
            </p>
            <a href="#booking" className="inline-block">
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all">
                Reserve Two-Day Package
              </button>
            </a>
          </div>
          {/* Right - Image */}
          <div className="w-[400px] h-[400px]">
            <img
              src="/images/4.png"
              alt="Car Booking"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

       <section className="py-12 px-4 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center ">
          {/* Left - */}
          <div className="w-[400px] h-[400px]">
            <img
              src="/images/5.png"
              alt="Car Booking"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>

          {/* Right -  Content */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800"> Chennai to Tirupati Car Rental Package – Flexible & Private</h2>
            <p className="text-gray-600">
             Want to travel at your own pace? Our Chennai to Tirupati car rental package is the most flexible option for families or groups with their own darshan plans. Choose your preferred cab—Etios, Innova, Crysta, or Tempo Traveller—and enjoy a private, sanitized ride with experienced drivers.
            </p>
            <p className="text-gray-600">
             This customizable Tirupati travel package from Chennai is perfect if you already have darshan tickets and want full control of your journey. Garuda’s Tirupati Chennai package by car ensures safety, transparency, and peace of mind every mile of the way.
            </p>
            <a href="#booking">
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all">
             Get VIP Darshan Now
            </button>
            </a>
            
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center ">
          {/* Left - Content*/}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Temple Tour Packages from Chennai – South India’s Spiritual Trail</h2>
            <p className="text-gray-600">
             Garuda Tours and Travels curates the best temple tour packages from Chennai, covering spiritual destinations like Tirupati, Rameswaram, Kanchipuram, Madurai, and more. Whether it's a short Chennai to Tirupati travel package or a multi-day journey, we plan it all with devotion and care.
            </p>
            <p className="text-gray-600">
              These expertly crafted temple tour packages near Chennai are perfect for spiritual seekers, senior citizens, and families looking for a divine escape. Discover South India’s sacred routes with Garuda’s trusted services.
            </p>
            <a href="#booking" className="inline-block">
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all">
                Explore All Temple Tours
              </button>
            </a>
          </div>
          {/* Right - Image */}
          <div className="w-[400px] h-[400px]">
            <img
              src="/images/1.png"
              alt="Car Booking"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>
      <CustomerReviews />
      <Counter />
    </div>
  )
}

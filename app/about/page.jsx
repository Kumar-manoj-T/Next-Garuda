"use client"

import Image from "next/image"
import { BriefcaseMedical, UserCheck, Award, PlayCircle, ShieldUser, TruckElectric   } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import StatsCounter from "@/components/stats-counter"
import BookingForm from "@/components/booking-form"
import CustomerReviews from "@/components/customer-reviews"
// import CircleCard from "@/components/about/CircleCard"

export default function AboutUs() {
  const data = [
    {
      Icon: ShieldUser,
      title: "Safety First Always",
      description: "All vehicles are GPS-tracked, sanitized, and operated by verified, professional drivers to ensure every journey is safe and reliable."
    },
    {
      Icon: TruckElectric,
      title: "Trusted Travel Guides",
      description: " Our coordinators and trip managers assist you throughout your journey—from pickup in Chennai to darshan at Tirumala."
    },
    {
      Icon: TruckElectric ,
      title: " Expertise & Experience",
      description: "With 5+ years of specialized experience in Tirupati and temple tour travel, we handle every trip with devotion and perfection."
    },
    {
      Icon: TruckElectric ,
      title: "Customized Pilgrimage Plans",
      description: "We understand every pilgrim is different. That’s why we offer flexible tour options: one-day, two-day, and car rental packages—all designed around your schedule."
    }
  ];
  return (
    <>
     <Header />
    <section className="py-16 px-4 bg-gray-100">
     
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Content */}
        <div className="flex flex-col items-start">
          {/* About Us Label */}
          <span className="inline-block bg-[#e6ffe6] text-[#4CAF50] text-sm font-semibold px-4 py-1 rounded-full mb-4">
            About Us
          </span>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            About Garuda Tours and Travels.
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            At Garuda Tours and Travels, we are more than just a travel company — we are a bridge between devotion and destination. With years of dedicated service, we’ve become a trusted name for thousands seeking Chennai to Tirupati tour packages, VIP darshan services, and temple tour packages across South India.
          </p>
           <p className="text-gray-600 mb-8 leading-relaxed">
           We specialize in Chennai to Tirupati one-day packages, two-day travel packages, and customized spiritual journeys for individuals, families, and senior citizens. Whether it's a quick Tirupati darshan package from Chennai or an extended temple tour to Rameswaram, Kanchipuram, or Thiruvannamalai, we ensure every trip is smooth, punctual, and soul-satisfying.
          </p>
           <p className="text-gray-600 mb-8 leading-relaxed">
            What sets us apart is our commitment to on-time service, well-maintained vehicles, expert travel coordination, and 24/7 support. Every Tirupati package from Chennai is designed to offer a peaceful, safe, and divine travel experience.
          </p>

           <p className="text-gray-600 mb-8 leading-relaxed">
            Join the growing family of satisfied devotees who trust Garuda for their Chennai to Tirupati travel needs. Let your next pilgrimage begin with comfort, care, and Garuda’s blessings.
           </p>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 w-full">
            {/* Safety First Always */}
            <div className="flex items-center p-4 rounded-lg bg-[#e6ffe6] shadow-sm">
              <div className="p-2 rounded-full bg-white mr-3">
                <BriefcaseMedical className="h-6 w-6 text-[#4CAF50]" />
              </div>
              <span className="font-medium text-gray-700">Safety First Always</span>
            </div>

            {/* Trusted Travel Guide */}
            <div className="flex items-center p-4 rounded-lg bg-[#fff8e1] shadow-sm">
              <div className="p-2 rounded-full bg-white mr-3">
                <UserCheck className="h-6 w-6 text-[#FFC107]" />
              </div>
              <span className="font-medium text-gray-700">Trusted Travel Guide</span>
            </div>

            {/* Expertise And Experience (1) */}
            <div className="flex items-center p-4 rounded-lg bg-[#fff8e1] shadow-sm">
              <div className="p-2 rounded-full bg-white mr-3">
                <Award className="h-6 w-6 text-[#FFC107]" />
              </div>
              <span className="font-medium text-gray-700">Expertise And Experience</span>
            </div>

            {/* Expertise And Experience (2) */}
            <div className="flex items-center p-4 rounded-lg bg-[#e6ffe6] shadow-sm">
              <div className="p-2 rounded-full bg-white mr-3">
                <Award className="h-6 w-6 text-[#4CAF50]" />
              </div>
              <span className="font-medium text-gray-700">Expertise And Experience</span>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#booking">
               <Button className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-8 py-3 text-lg rounded-full">
             Book Now
            </Button>
            </a>
           
            {/* <Button variant="ghost" className="text-gray-700 hover:text-blue-600 px-6 py-3 text-lg rounded-full">
              <PlayCircle className="h-6 w-6 mr-2 text-blue-600" />
              Watch Tour
            </Button> */}
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="relative flex justify-center lg:justify-end">
          <Image
            src="/images/Balaji.webp?height=600&width=600" // Placeholder for the main image
            alt="Travelers exploring"
            width={600}
            height={600}
            className="rounded-lg object-cover w-full max-w-md lg:max-w-full h-auto shadow-lg"
          />
          {/* Years of Experience Badge */}
          <div className="absolute bottom-4 right-4 bg-[#4CAF50] text-white px-6 py-3 rounded-lg shadow-md flex items-center space-x-2">
            <span className="text-3xl font-bold">05</span>
            <span className="text-sm leading-tight">
              Years of
              <br />
              experience
            </span>
          </div>
        </div>
      </div>
    </section>
     {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8">
         {data.map((item, index) => (
          <CircleCard
            key={index}
            Icon={item.Icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </div> */}
    <BookingForm />
     <StatsCounter />
     <CustomerReviews />
    <Footer />
    </>
  )
}

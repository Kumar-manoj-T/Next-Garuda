"use client"

import Header from "@/components/header"
import HeroSlider from "@/components/home/hero-slider"
import BookingForm from "@/components/booking-form"
import TourPackages from "@/components/home/tour-packages"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSlider />
      <BookingForm />
      <TourPackages />
      <Footer/>
    </div>
  )
}

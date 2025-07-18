"use client"

import Header from "@/components/header"
import HeroSlider from "@/components/home/hero-slider"
import BookingForm from "@/components/booking-form"
import TourPackages from "@/components/home/tour-packages"
import Footer from "@/components/footer"
import Vehicl from "@/components/home/vehicle-slider"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      
      <HeroSlider />
      <BookingForm />
      <TourPackages />
      <Vehicl/>
     
    </div>
  )
}

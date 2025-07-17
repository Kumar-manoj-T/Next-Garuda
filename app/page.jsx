"use client"

import Header from "@/components/header"
import HeroSlider from "@/components/hero-slider"
import BookingForm from "@/components/booking-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSlider />
      <BookingForm />
    </div>
  )
}

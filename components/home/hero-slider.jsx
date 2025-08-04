"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    id: 1,
    image: "/images/slider3.png",
    title: "Best Temple Tour Packages from Chennai – Spiritual Travel with Garuda",
    description:"Plan your spiritual journey with Garuda’s temple tour packages from Chennai to Tirupati, Rameswaram, Kanchipuram & more. Comfortable rides, expert planning & divine experiences.",
    buttonText: "Explore Packages",
  },
  {
    id: 2,
    image: "/images/hero2.png",
    title: "Chennai to Tirupati One Day Package – Easy & Spiritual",
    description:"Book the top-rated Chennai to Tirupati one-day package from Chennai. Enjoy hassle-free VIP darshan, comfortable travel and fast reservations with Garuda’s Chennai to Tirupati travel package.",
    buttonText:"Book One-Day Package"
  },
  {
    id: 3,
    image: "/images/hero1.png",
    title: "Tirupati Darshan Package from Chennai – VIP & Quick",
    description:"Opt for a Tirupati darshan package from Chennai with priority access. Garuda’s VIP darshan package from Chennai to Tirupati ensures peaceful darshan and personalized support.",
    buttonText: "Book VIP Darshan",
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50" />

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white px-4 max-w-4xl">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">{slide.title}</h1>
                <p className="text-lg md:text-xl lg:text-2xl mb-8 leading-relaxed opacity-90">{slide.description}</p>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  {slide.buttonText || "Learn More"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 z-20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 z-20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide ? "bg-white" : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
          />
        ))}
      </div>
    </section>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Car , Users, CheckCircle, Handshake } from "lucide-react" // Using Lucide React for icons

const stats = [
  {
    id: 1,
    icon: Car ,
    value: "30+",
    label: "Vehicles",
    endValue: 30,
    suffix: "+",
  },
  {
    id: 2,
    icon: Users,
    value: "389+",
    label: "Our Drivers",
    endValue: 389,
    suffix: "+",
  },
  {
    id: 3,
    icon: CheckCircle,
    value: "5K",
    label: "Happy Customers",
    endValue: 5, // Changed to 5 for '5K' to work with multiplication
    suffix: "K",
  },
  {
    id: 4,
    icon: Handshake,
    value: "98%",
    label: "Success Rates",
    endValue: 98,
    suffix: "%",
  },
]

export default function StatsCounter() {
  const [counts, setCounts] = useState(stats.map(() => 0))
  const refs = useRef([]) // Array to hold refs for each stat item
  const animatedStates = useRef(stats.map(() => false)) // To track if an item has animated

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.dataset.index, 10) // Get index from data-attribute
            if (!animatedStates.current[index]) {
              let startTime
              const duration = 2000 // Animation duration in ms
              const endValue = stats[index].endValue

              const animateCount = (timestamp) => {
                if (!startTime) startTime = timestamp
                const progress = (timestamp - startTime) / duration
                const currentCount = Math.min(progress * endValue, endValue)

                setCounts((prevCounts) => {
                  const newCounts = [...prevCounts]
                  newCounts[index] = Math.floor(currentCount)
                  return newCounts
                })

                if (progress < 1) {
                  requestAnimationFrame(animateCount)
                } else {
                  setCounts((prevCounts) => {
                    const newCounts = [...prevCounts]
                    newCounts[index] = endValue // Ensure final value is exact
                    return newCounts
                  })
                  animatedStates.current[index] = true // Mark as animated
                }
              }
              requestAnimationFrame(animateCount)
            }
          }
        })
      },
      { threshold: 0.5 }, // Trigger when 50% of the element is visible
    )

    // Observe each element
    refs.current.forEach((ref) => {
      if (ref) {
        // Ensure the ref exists (element is mounted)
        observer.observe(ref)
      }
    })

    return () => {
      // Disconnect observer on unmount
      refs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref)
        }
      })
    }
  }, []) // Empty dependency array means this runs once on mount

  return (
    <section
      className="relative py-20 px-4 bg-gray-100 overflow-hidden"
      style={{
        backgroundImage: `url(/placeholder.svg?height=800&width=1600)`, // Placeholder for background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Parallax effect
      }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-80" /> {/* Semi-transparent overlay */}
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const count = counts[index]

            let displayValue = count
            if (stat.suffix === "K") {
              displayValue = `${count}${stat.suffix}`
            } else if (stat.suffix === "%") {
              displayValue = `${count}${stat.suffix}`
            } else {
              displayValue = `${count}${stat.suffix}`
            }

            return (
              <div
                key={stat.id}
                data-index={index} // Add data-index to identify the element
                ref={(el) => (refs.current[index] = el)} // Assign ref directly
                className="flex flex-col items-center p-4"
              >
                <div className="relative w-24 h-24 rounded-full bg-white border-2 border-red-500 flex items-center justify-center mb-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Icon className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="text-5xl font-bold text-gray-800 mb-2">{displayValue}</h3>
                <p className="text-lg text-gray-600">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

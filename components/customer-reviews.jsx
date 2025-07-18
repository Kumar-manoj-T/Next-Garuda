"use client"

import Image from "next/image"
import { Quote } from "lucide-react" // Using Quote icon for decorative purposes

const customerReviews = [
  {
    id: 1,
    avatar: "/placeholder.svg?height=64&width=64", // Placeholder for customer avatar
    name: "Priya Sharma",
    location: "Chennai, India",
    content:
      "Garuda Tours & Travels provided an exceptional experience! The Tirupati package was well-organized, and the team was incredibly supportive throughout the journey. Highly recommended for a spiritual and hassle-free trip.",
  },
  {
    id: 2,
    avatar: "/placeholder.svg?height=64&width=64", // Placeholder for customer avatar
    name: "David Lee",
    location: "Singapore",
    content:
      "The car rental service was top-notch. Clean vehicle, punctual driver, and very flexible with our itinerary. Made our family trip around Chennai very comfortable and enjoyable. Will definitely use again!",
  },
  {
    id: 3,
    avatar: "/placeholder.svg?height=64&width=64", // Placeholder for customer avatar
    name: "Maria Garcia",
    location: "Madrid, Spain",
    content:
      "Our Temple Tour Package was a dream come true. Every detail was meticulously planned, from the historical insights provided by the guide to the comfortable accommodations. A truly enriching cultural journey!",
  },
  {
    id: 4,
    avatar: "/placeholder.svg?height=64&width=64", // Placeholder for customer avatar
    name: "Ahmed Khan",
    location: "Dubai, UAE",
    content:
      "Excellent service from start to finish. The booking process was smooth, and the staff were very responsive to all our queries. They ensured we had a memorable and stress-free vacation. Thank you, Garuda!",
  },
]

export default function CustomerReviews() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">What Our Customers Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {customerReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-lg p-6 relative overflow-hidden">
              {/* Full round image icon in top-left corner */}
              <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-white border-2 border-red-500 flex items-center justify-center shadow-md">
                <Image
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover" // Image itself is a smaller circle inside the larger one
                />
              </div>

              {/* Quote icon for decoration */}
              <div className="absolute top-6 right-6 text-gray-200">
                <Quote className="h-10 w-10" />
              </div>

              {/* Review Content */}
              <p className="text-gray-700 mb-4 mt-12 leading-relaxed">{review.content}</p>

              {/* Customer Name and Location */}
              {/* Customer Name and Location with a larger avatar */}
              <div className="flex items-center justify-start gap-4 mt-4">
                <Image
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.location}</p>
                </div>
              </div>


            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

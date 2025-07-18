"use client"

import Image from "next/image"
import { BriefcaseMedical, UserCheck, Award, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutUs() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Content */}
        <div className="flex flex-col items-start">
          {/* About Us Label */}
          <span className="inline-block bg-[#e6ffe6] text-[#4CAF50] text-sm font-semibold px-4 py-1 rounded-full mb-4">
            About Us
          </span>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            We provide the best tour facilities.
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Etiama ac tortor id purus commodo vulputate. Vestibulum porttitor erat felis and sed vehicula tortor
            malesuada gravida. Mauris volutpat enim quis pulv gont congue. Suspendisse ullamcorper.
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
            <Button className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-8 py-3 text-lg rounded-full">
              Find Out More
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 px-6 py-3 text-lg rounded-full">
              <PlayCircle className="h-6 w-6 mr-2 text-blue-600" />
              Watch Tour
            </Button>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="relative flex justify-center lg:justify-end">
          <Image
            src="/placeholder.svg?height=600&width=600" // Placeholder for the main image
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
  )
}

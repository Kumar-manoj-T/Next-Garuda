"use client";
import Image from "next/image";

export default function PassengerNoteBox() {
  return (
    <div className="max-w-5xl mx-auto mb-5 p-4 border border-black rounded-md flex items-center gap-6">
      {/* Left: Image */}
      <div className="w-28 h-28 flex-shrink-0">
        <Image
          src="/passenger-icon.svg" // 🔁 Replace this with your image
          alt="Passenger Note Icon"
          width={112}
          height={112}
          className="object-contain w-full h-full"
        />
      </div>

      {/* Right: Text and Button (Stacked) */}
      <div className="flex flex-col justify-center gap-2">
        <h3 className="text-xl font-semibold text-gray-800">Important: Chennai to Tirupati Package Booking Info</h3>
        <p className="text-sm text-gray-700">
           Package prices for Chennai to Tirupati could vary due to darshan slot availability. To secure your Chennai to Tirupati oneday package at the listed rate, book 45 days in advance. For Tirupati package from Chennai, or VIP Tirupati darshan package information, call us at +91 98407 89844 / +91 98407 89857. Garuda Tours and Travels guarantees no hidden costs. Book early and travel spiritually.

        </p>
        <button className="mt-2 px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 w-fit">
          Call to Confirm Your Tirupati Package
        </button>
      </div>
    </div>
  );
}

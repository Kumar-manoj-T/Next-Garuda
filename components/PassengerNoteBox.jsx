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
        <h3 className="text-xl font-semibold text-gray-800">Passenger's Note</h3>
        <p className="text-sm text-gray-700">
          Website shows package price is currently unavailable for now. Book 45 days in advance to lock in the displayed website price. <br />
          Call +91 98407 89844 / +91 98407 89857 for details on upcoming Tirupati trips.
        </p>
        <button className="mt-2 px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 w-fit">
          Book Now
        </button>
      </div>
    </div>
  );
}

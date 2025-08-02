"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Star,
  Snowflake,
  Users,
  Route,
  IndianRupee,
  UserCog,
} from "lucide-react";

const vehicleList = [
  {
    id: 1,
    image: "/cars/innova.png",
    name: "Innova ",
    rating: 4.5,
    hasAC: true,
    seats: 7,
    minKm: 300,
    driverBeta: 600,
    perKmRate: 21,
  },
  {
    id: 2,
    image: "/cars/ertiga.png",
    name: "Ertiga",
    rating: 4.2,
    hasAC: true,
    seats: 7,
    minKm: 250,
    driverBeta: 500,
    perKmRate: 18,
  },
  {
    id: 3,
    image: "/cars/swift.png",
    name: "Dzire or Etios",
    rating: 4.0,
    hasAC: true,
    seats: 4,
    minKm: 200,
    driverBeta: 400,
    perKmRate: 15,
  },
  {
    id: 4,
    image: "/cars/crysta.png",
    name: "Innova Crysta ",
    rating: 4.3,
    hasAC: true,
    seats: 4,
    minKm: 220,
    driverBeta: 450,
    perKmRate: 16,
  },
  {
    id: 5,
    image: "/cars/tempo.png",
    name: "Tempo Traveller",
    rating: 4.7,
    hasAC: true,
    seats: 12,
    minKm: 350,
    driverBeta: 700,
    perKmRate: 25,
  },
 
];

function chunkArray(array, size) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

export default function VehiclePricing() {
  const rows = chunkArray(vehicleList, 3);
  return (
    <section className="py-12 px-4 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Vehicle Price List
        </h2>

        {/* Loop Rows */}
        {rows.map((row, index) => (
          <div
            key={index}
            className={`flex flex-wrap justify-center md:justify-${
              row.length === 3 ? "between" : "center"
            } gap-8 mb-8`}
          >
            {row.map((vehicle) => (
              <div key={vehicle.id} className="w-full md:w-[30%]">
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function VehicleCard({ vehicle }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative w-full h-64">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-6 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{vehicle.name}</h3>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={16} />
            <span>{vehicle.rating}</span>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Snowflake size={16} />
            <span>{vehicle.hasAC ? "AC" : "Non-AC"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{vehicle.seats} seats</span>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Route size={16} />
            <span>{vehicle.minKm} km</span>
          </div>
          <div className="flex items-center gap-1">
            <UserCog size={16} />
            <span>₹{vehicle.driverBeta}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1 text-base font-medium">
            <IndianRupee size={16} />
            <span>{vehicle.perKmRate}/km</span>
          </div>
          <a href="#booking">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 text-sm">
            Book
          </Button>
          </a>
          
        </div>
      </div>
    </div>
  );
}

"use client"

import CarRentalPackageForm from "@/components/car-rental-package-form"

export default function EditCarRentalPackagePage({ params }) {
  const { id } = params
  return <CarRentalPackageForm packageId={id} />
}

"use client"

import TemplePackageForm from "@/components/temple-package-form"

export default function EditTemplePackagePage({ params }) {
  const { id } = params
  return <TemplePackageForm packageId={id} />
}

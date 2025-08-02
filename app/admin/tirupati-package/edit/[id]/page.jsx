"use client"

import PackageForm from "@/components/tirupati-packagesForm"

export default function EditTirupatiPackagePage({ params }) {
  const { id } = params // Extract the dynamic 'id' from the URL

  return <PackageForm packageType="tirupati-package" packageId={id} />
}

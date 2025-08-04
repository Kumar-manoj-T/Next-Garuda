
"use client"

import React from "react" // Import React to use React.use()
import PackageForm from "@/components/tirupati-packagesForm"

export default function EditTirupatiPackagePage({ params: paramsPromise }) {
  // Unwrap the params promise using React.use()
  const params = React.use(paramsPromise)
  const { id } = params // Extract the dynamic 'id' from the unwrapped params

  return <PackageForm packageType="tirupati-package" packageId={id} />
}

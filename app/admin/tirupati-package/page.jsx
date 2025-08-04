"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { isAuthenticated } from "@/lib/custom-auth" // Import custom auth check
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog" // Import AlertDialog components

export default function TirupatiPackageListPage() {
  const router = useRouter()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [clientAuthenticated, setClientAuthenticated] = useState(false)
  const { toast } = useToast()

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [packageToDelete, setPackageToDelete] = useState(null)

  const packageType = "tirupati-package"

  // Client-side authentication check
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated()
      setClientAuthenticated(authStatus)
      if (!authStatus) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access the admin panel.",
          variant: "destructive",
        })
        router.push("/admin")
      }
    }
    checkAuth()
  }, [router, toast])

  const fetchPackages = async () => {
    setLoading(true)
    setError(null)
    try {
      const q = query(collection(db, packageType), orderBy("order", "desc"))
      const querySnapshot = await getDocs(q)
      const fetchedPackages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setPackages(fetchedPackages)
    } catch (err) {
      console.error("Error fetching packages:", err)
      setError("Failed to load packages. Please check your Firebase setup and security rules.")
      toast({
        title: "Error Loading Packages ❌",
        description: "Failed to fetch data. Check console for details and Firebase security rules.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (clientAuthenticated) {
      fetchPackages()
    }
  }, [packageType, toast, clientAuthenticated])

  // Function to open the delete confirmation dialog
  const handleDeleteClick = (packageId, imageUrls, packageTitle) => {
    setPackageToDelete({ id: packageId, imageUrls, title: packageTitle })
    setIsDeleteDialogOpen(true)
  }

  // Function to perform the actual deletion after confirmation
  const confirmDelete = async () => {
    if (!packageToDelete) return

    const { id: packageId, imageUrls, title: packageTitle } = packageToDelete

    try {
      // 1. Delete images from Firebase Storage
      const folderName =
        packageTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "untitled-package"
      const storagePathPrefix = `${packageType}/${folderName}`

      for (const url of imageUrls) {
        try {
          // Extract path from URL (e.g., "tirupati-package/family-package/img1.jpg")
          const path = decodeURIComponent(url.split(`${storagePathPrefix}/`)[1].split("?")[0])
          const imageRef = ref(storage, `${storagePathPrefix}/${path}`)
          await deleteObject(imageRef)
          console.log(`Deleted image: ${path}`)
        } catch (storageErr) {
          console.warn(`Could not delete image ${url}:`, storageErr.message)
          // Continue even if one image fails to delete, to try deleting the document
        }
      }

      // 2. Delete document from Firestore
      await deleteDoc(doc(db, packageType, packageId))

      toast({
        title: "Package Deleted! ✅",
        description: `"${packageTitle}" has been successfully removed.`,
        variant: "success",
      })
      // Refresh the list
      fetchPackages()
    } catch (err) {
      console.error("Error deleting package:", err)
      toast({
        title: "Deletion Failed ❌",
        description: `Failed to delete package: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false) // Close dialog regardless of success/failure
      setPackageToDelete(null) // Clear package to delete state
    }
  }

  // Render null or loading state if not authenticated yet
  if (!clientAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Checking authentication...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading Tirupati packages...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 text-center">{error}</p>
        <Button onClick={() => fetchPackages()} className="mt-4">
          Retry
        </Button>
        <Button onClick={() => router.push("/admin/dashboard")} className="mt-4 ml-2">
          Go to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Tirupati Packages</h1>
        <Link href={`/admin/tirupati-package/create`} passHref>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add New Package</Button>
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="text-center text-gray-600 text-xl mt-16">
          No Tirupati packages found. Click "Add New Package" to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{pkg.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex gap-2">
                  <Link href={`/admin/tirupati-package/edit/${pkg.id}`} passHref>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(pkg.id, pkg.images || [], pkg.title)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <span className="font-semibold text-red-600">"{packageToDelete?.title}"</span> package and remove its
              associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

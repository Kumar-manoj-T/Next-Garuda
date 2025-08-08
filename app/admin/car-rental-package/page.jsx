"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2 } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/custom-auth"

export default function ManageCarRentalPackagesPage() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [clientAuthenticated, setClientAuthenticated] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

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
    try {
      const querySnapshot = await getDocs(collection(db, "carRentalPackages"))
      const fetchedPackages = querySnapshot.docs.map((docu) => ({
        id: docu.id,
        ...docu.data(),
      }))
      const filteredPackages = fetchedPackages
        .filter((p) => !(p?.isDeleted || p?.deletedAt))
        .sort((a, b) => (a.order || 0) - (b.order || 0))
      setPackages(filteredPackages)
    } catch (error) {
      console.error("Error fetching packages:", error)
      toast({
        title: "Error",
        description: "Failed to load packages.",
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
  }, [clientAuthenticated])

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this package? This will move it to the recycle bin.")) {
      return
    }
    try {
      await updateDoc(doc(db, "carRentalPackages", id), {
        isDeleted: true,
        deletedAt: serverTimestamp(),
      })
      toast({
        title: "Moved to Recycle Bin",
        description: "Package was soft-deleted successfully.",
        variant: "default",
      })
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id))
    } catch (error) {
      console.error("Error soft-deleting package:", error)
      toast({
        title: "Error",
        description: `Failed to delete package: ${error.message}`,
        variant: "destructive",
      })
    }
  }

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
        <div className="text-xl font-semibold text-gray-700">Loading packages...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Car Rental Packages</h1>
          <Link href="/admin/car-rental-package/create" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Package
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>All Packages</CardTitle>
          </CardHeader>
          <CardContent>
            {packages.length === 0 ? (
              <p className="text-center text-gray-600 py-8">No car rental packages found. Create one!</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{pkg.order || 0}</TableCell>
                        <TableCell className="font-medium">{pkg.title || 'Untitled'}</TableCell>
                        <TableCell className="text-sm text-gray-600">{pkg.url || pkg.id}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            pkg.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {pkg.isActive !== false ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/car-rental-package/edit/${pkg.id}`} passHref>
                            <Button variant="ghost" size="icon" className="mr-2">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(pkg.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

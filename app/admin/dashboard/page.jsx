"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { isAuthenticated, logoutUser } from "@/lib/custom-auth" // Import custom auth functions

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Protect this route client-side
  useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the admin dashboard.",
        variant: "destructive",
      })
      router.push("/admin")
    }
  }, [router, toast])

  const packageTypes = [
    { title: "Tirupati Package", slug: "tirupati-package" },
    { title: "Temple Tour Package", slug: "temple-package" },
    { title: "Car Rental Package", slug: "carrental-package" },
  ]

  const handleLogout = () => {
    logoutUser()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default",
    })
    router.push("/admin")
  }

  // Render null or a loading state if not authenticated yet to prevent flickering
  if (!isAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Checking authentication...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-end mb-8">
        <Button onClick={handleLogout} variant="outline" className="bg-red-500 hover:bg-red-600 text-white">
          Logout
        </Button>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packageTypes.map((pkgType) => (
          <Card key={pkgType.slug} className="flex flex-col">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle>{pkgType.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600">Manage {pkgType.title} entries.</p>
              <Link href={`/admin/dashboard/${pkgType.slug}`} passHref>
                <Button variant="outline" className="mt-4 w-full bg-transparent">
                  View All {pkgType.title}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

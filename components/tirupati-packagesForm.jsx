"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { isAuthenticated } from "@/lib/custom-auth" // Import custom auth check

// Helper to generate unique IDs for dynamic fields
const generateUniqueId = () => Math.random().toString(36).substring(2, 15)

export default function PackageForm({ packageType, packageId }) {
  const router = useRouter()
  const { toast } = useToast()

  // Core package fields
  const [packageUrl, setPackageUrl] = useState("") // New: Used as document ID
  const [title, setTitle] = useState("")
  const [packageOrder, setPackageOrder] = useState(1) // New: Package Order
  const [tripDays, setTripDays] = useState("1") // New: Trip Days
  const [subtitle, setSubtitle] = useState("") // Existing, but not in HTML snippet
  const [content, setContent] = useState("") // Existing, but not in HTML snippet

  // Image management
  const [images, setImages] = useState([]) // Stores URLs of existing images
  const [newImageFiles, setNewImageFiles] = useState([]) // Stores File objects for new uploads

  // Dynamic sections
  const [packagesAndCars, setPackagesAndCars] = useState([]) // Corresponds to 'packages' in HTML
  const [includes, setIncludes] = useState([])
  const [itineraries, setItineraries] = useState([])
  const [passengerNotes, setPassengerNotes] = useState([]) // Corresponds to 'notes' in HTML
  const [sightseeingPlaces, setSightseeingPlaces] = useState([]) // Corresponds to 'places' in HTML
  const [carPrices, setCarPrices] = useState([]) // Corresponds to 'cars' in HTML
  const [sections, setSections] = useState([]) // Corresponds to 'section' in HTML
  const [faqs, setFaqs] = useState([]) // Corresponds to 'faq' in HTML

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [clientAuthenticated, setClientAuthenticated] = useState(false) // New state for client-side auth

  const isEditMode = !!packageId // packageId will now be the URL slug

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

  useEffect(() => {
    if (isEditMode && clientAuthenticated) {
      // Only fetch if in edit mode AND authenticated on client
      const fetchPackage = async () => {
        try {
          const docRef = doc(db, packageType, packageId) // packageId is now the URL slug
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            const data = docSnap.data()
            setPackageUrl(packageId) // Set URL from the ID
            setTitle(data.title || "")
            setPackageOrder(data.order || 1)
            setTripDays(data.days || "1")
            setImages(data.images || [])
            setPackagesAndCars(data.packagesAndCars || [])
            setIncludes(data.includes || [])
            setItineraries(data.itineraries || [])
            setPassengerNotes(data.passengerNotes || [])
            setSightseeingPlaces(data.sightseeingPlaces || [])
            setCarPrices(data.carPrices || [])
            setSections(data.sections || [])
            setFaqs(data.faqs || [])
            // Keep existing subtitle and content if they were part of the old structure
            setSubtitle(data.subtitle || "")
            setContent(data.content || "")
          } else {
            toast({
              title: "Error",
              description: "Package not found.",
              variant: "destructive",
            })
            router.push(`/admin/${packageType}`)
          }
        } catch (err) {
          console.error("Error fetching package for edit:", err)
          toast({
            title: "Error",
            description: "Failed to load package data.",
            variant: "destructive",
          })
        } finally {
          setInitialLoading(false)
        }
      }
      fetchPackage()
    } else if (!isEditMode && clientAuthenticated) {
      // If not edit mode, and authenticated, stop initial loading
      setInitialLoading(false)
    }
  }, [packageId, packageType, isEditMode, router, toast, clientAuthenticated])

  const handleFileChange = (e) => {
    if (e.target.files) {
      setNewImageFiles((prev) => [...prev, ...Array.from(e.target.files)])
    }
  }

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (urlToRemove) => {
    setImages((prev) => prev.filter((url) => url !== urlToRemove))
  }

  // --- Dynamic Field Handlers ---

  // Generic add/remove for simple text points (includes, itineraries, notes, places)
  const addPoint = (setter) => {
    setter((prev) => [...prev, { id: generateUniqueId(), text: "" }])
  }
  const updatePoint = (setter, id, newText) => {
    setter((prev) => prev.map((item) => (item.id === id ? { ...item, text: newText } : item)))
  }
  const removePoint = (setter, id) => {
    setter((prev) => prev.filter((item) => item.id !== id))
  }

  // Packages and Cars (e.g., { packageName: "Standard", carType: "Swift", price: "1500" })
  const addPackageAndCar = () => {
    setPackagesAndCars((prev) => [...prev, { id: generateUniqueId(), packageName: "", carType: "", price: "" }])
  }
  const updatePackageAndCar = (id, field, value) => {
    setPackagesAndCars((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }
  const removePackageAndCar = (id) => {
    setPackagesAndCars((prev) => prev.filter((item) => item.id !== id))
  }

  // Car Prices (e.g., { carName: "Swift", rpPrice: "2500", telanPrice: "3000", ... })
  const addCarPrice = () => {
    setCarPrices((prev) => [
      ...prev,
      { id: generateUniqueId(), carName: "", rpPrice: "", telanPrice: "", bangPrice: "", pondiPrice: "" },
    ])
  }
  const updateCarPrice = (id, field, value) => {
    setCarPrices((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }
  const removeCarPrice = (id) => {
    setCarPrices((prev) => prev.filter((item) => item.id !== id))
  }

  // Sections (e.g., { title: "Section Title", content: "Section Content" })
  const addSection = () => {
    setSections((prev) => [...prev, { id: generateUniqueId(), title: "", content: "" }])
  }
  const updateSection = (id, field, value) => {
    setSections((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }
  const removeSection = (id) => {
    setSections((prev) => prev.filter((item) => item.id !== id))
  }

  // FAQs (e.g., { question: "Q?", answer: "A." })
  const addFaq = () => {
    setFaqs((prev) => [...prev, { id: generateUniqueId(), question: "", answer: "" }])
  }
  const updateFaq = (id, field, value) => {
    setFaqs((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }
  const removeFaq = (id) => {
    setFaqs((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    console.log("Form submission started.")

    if (!packageUrl) {
      toast({
        title: "Validation Error",
        description: "Package URL is required.",
        variant: "destructive",
      })
      setLoading(false)
      console.error("Validation failed: Package URL is empty.")
      return
    }

    try {
      // 1. Upload new images to Firebase Storage
      const uploadedImageUrls = []
      const folderName =
        packageUrl
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "untitled-package"
      const storagePathPrefix = `${packageType}/${folderName}`
      console.log(`Storage path prefix: ${storagePathPrefix}`)
      console.log(`Number of new image files to upload: ${newImageFiles.length}`)

      for (const file of newImageFiles) {
        console.log(`Attempting to upload file: ${file.name}`)
        const imageRef = ref(storage, `${storagePathPrefix}/${file.name}`)
        await uploadBytes(imageRef, file)
        const url = await getDownloadURL(imageRef)
        uploadedImageUrls.push(url)
        console.log(`Uploaded ${file.name}, URL: ${url}`)
      }

      // Combine existing images with newly uploaded ones
      const allImageUrls = [...images, ...uploadedImageUrls]
      console.log("All image URLs (existing + new):", allImageUrls)

      // 2. Prepare package data
      const packageData = {
        url: packageUrl,
        title,
        order: packageOrder,
        days: tripDays,
        images: allImageUrls,
        packagesAndCars,
        includes,
        itineraries,
        passengerNotes,
        sightseeingPlaces,
        carPrices,
        sections,
        faqs,
        subtitle,
        content,
        createdAt: isEditMode ? (await getDoc(doc(db, packageType, packageId))).data().createdAt : Timestamp.now(),
        updatedAt: Timestamp.now(),
      }
      console.log("Prepared package data:", packageData)

      // 3. Save/Update document in Firestore using packageUrl as document ID
      const docRef = doc(db, packageType, packageUrl)
      console.log(`Attempting to save document to Firestore at path: ${packageType}/${packageUrl}`)
      await setDoc(docRef, packageData) // setDoc handles both create and update
      console.log("Document successfully saved to Firestore!")

      toast({
        title: "Success! 🎉",
        description: isEditMode ? "Package updated successfully." : "New package added successfully.",
        variant: "success",
      })

      router.push(`/admin/${packageType}`) // Redirect to the list page
    } catch (err) {
      console.error("Error saving package:", err)
      toast({
        title: "Error ❌",
        description: `Failed to save package: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      console.log("Form submission finished.")
    }
  }

  if (!clientAuthenticated) {
    // Use clientAuthenticated here
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Checking authentication...</p>
      </div>
    )
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading form...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            {isEditMode ? `Edit ${getDisplayTitle(packageType)}` : `Add New ${getDisplayTitle(packageType)}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Package URL */}
            <div>
              <Label htmlFor="packageUrl">Package URL<span className="text-red-500">*</span></Label>
              <Input
                id="packageUrl"
                type="text"
                value={packageUrl}
                onChange={(e) => setPackageUrl(e.target.value)}
                required
                placeholder="Eg: chennai-to-tirupati"
                disabled={isEditMode} 
              />
              {isEditMode && <p className="text-sm text-gray-500 mt-1">URL cannot be changed after creation.</p>}
            </div>

            {/* Package Title */}
            <div>
              <Label htmlFor="title">Package Title<span className="text-red-500">*</span></Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Eg: Chennai to Tirupati"
              />
            </div>

            {/* Package Order */}
            <div>
              <Label htmlFor="packageOrder">Package Order<span className="text-red-500">*</span></Label>
              <Input
                id="packageOrder"
                type="number"
                min="1"
                value={packageOrder}
                onChange={(e) => setPackageOrder(Number(e.target.value))}
                required
                placeholder="Enter Package Order"
              />
            </div>

            {/* Trip Days */}
            <div>
              <Label htmlFor="tripDays">Trip Days<span className="text-red-500">*</span></Label>
              <select
                id="tripDays"
                value={tripDays}
                onChange={(e) => setTripDays(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                required
              >
                <option value="1">One Day</option>
                <option value="2">Two Days</option>
              </select>
            </div>

            {/* Package Image */}
            <div>
              <Label htmlFor="images">Package Image<span className="text-red-500">*</span></Label>
              <Input id="images" type="file" multiple onChange={handleFileChange} className="cursor-pointer" />
              <p className="text-sm text-gray-500 mt-1">Upload multiple images for this package.</p>

              {/* Display existing images */}
              {images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">Existing Images:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Existing image ${index + 1}`}
                          width={150}
                          height={100}
                          className="rounded-md object-cover w-full h-24"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeExistingImage(url)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove image</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display new image files to be uploaded */}
              {newImageFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">New Images to Upload:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {newImageFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={`New image ${index + 1}`}
                          width={150}
                          height={100}
                          className="rounded-md object-cover w-full h-24"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeNewImage(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove new image</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Package and Cars */}
            <div>
              <h4 className="heading text-lg font-semibold mb-2">Package and Cars</h4>
              <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                {packagesAndCars.map((item, index) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-2 items-end">
                    <div className="flex-1">
                      <Label htmlFor={`package-name-${item.id}`}>Package Name</Label>
                      <Input
                        id={`package-name-${item.id}`}
                        type="text"
                        value={item.packageName}
                        onChange={(e) => updatePackageAndCar(item.id, "packageName", e.target.value)}
                        placeholder="Eg: Standard Package"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`car-type-${item.id}`}>Car Type</Label>
                      <Input
                        id={`car-type-${item.id}`}
                        type="text"
                        value={item.carType}
                        onChange={(e) => updatePackageAndCar(item.id, "carType", e.target.value)}
                        placeholder="Eg: Swift/Etios"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`package-price-${item.id}`}>Price</Label>
                      <Input
                        id={`package-price-${item.id}`}
                        type="text"
                        value={item.price}
                        onChange={(e) => updatePackageAndCar(item.id, "price", e.target.value)}
                        placeholder="Eg: ₹ 1500"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePackageAndCar(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addPackageAndCar} className="mt-3">
                  Add Package
                </Button>
              </div>
            </div>

            {/* Package Includes */}
            <div>
              <h4 className="heading text-lg font-semibold mb-2">Package Includes</h4>
              <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                {includes.map((item) => (
                  <div key={item.id} className="flex gap-2 items-end">
                    <Input
                      type="text"
                      value={item.text}
                      onChange={(e) => updatePoint(setIncludes, item.id, e.target.value)}
                      placeholder="Eg: Driver Allowance"
                      className="flex-grow"
                    />
                    <Button type="button" variant="destructive" size="sm" onClick={() => removePoint(setIncludes, item.id)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => addPoint(setIncludes)} className="mt-3">
                  Add Point
                </Button>
              </div>
            </div>

            {/* Package Itinerary */}
            <div>
              <h4 className="heading text-lg font-semibold mb-2">Package Itinerary</h4>
              <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                {itineraries.map((item) => (
                  <div key={item.id} className="flex gap-2 items-end">
                    <Input
                      type="text"
                      value={item.text}
                      onChange={(e) => updatePoint(setItineraries, item.id, e.target.value)}
                      placeholder="Eg: Day 1: Chennai to Tirupati"
                      className="flex-grow"
                    />
                    <Button type="button" variant="destructive" size="sm" onClick={() => removePoint(setItineraries, item.id)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => addPoint(setItineraries)} className="mt-3">
                  Add Itinerary
                </Button>
              </div>
            </div>

            {/* Passenger Notes */}
            <div>
              <h4 className="heading text-lg font-semibold mb-2">Passenger Notes</h4>
              <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                {passengerNotes.map((item) => (
                  <div key={item.id} className="flex gap-2 items-end">
                    <Input
                      type="text"
                      value={item.text}
                      onChange={(e) => updatePoint(setPassengerNotes, item.id, e.target.value)}
                      placeholder="Eg: Carry valid ID proof"
                      className="flex-grow"
                    />
                    <Button type="button" variant="destructive" size="sm" onClick={() => removePoint(setPassengerNotes, item.id)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => addPoint(setPassengerNotes)} className="mt-3">
                  Add Point
                </Button>
              </div>
            </div>

            {/* Sightseeing Places */}
            <div>
              <h4 className="heading text-lg font-semibold mb-2">Sightseeing Places</h4>
              <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                {sightseeingPlaces.map((item) => (
                  <div key={item.id} className="flex gap-2 items-end">
                    <Input
                      type="text"
                      value={item.text}
                      onChange={(e) => updatePoint(setSightseeingPlaces, item.id, e.target.value)}
                      placeholder="Eg: Sri Venkateswara Temple"
                      className="flex-grow"
                    />
                    <Button type="button" variant="destructive" size="sm" onClick={() => removePoint(setSightseeingPlaces, item.id)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => addPoint(setSightseeingPlaces)} className="mt-3">
                  Add Point
                </Button>
              </div>
            </div>

            {/* Car Prices */}
            <div>
              <h4 className="heading text-lg font-semibold mb-2">Car Prices</h4>
              <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                {carPrices.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 items-end">
                    <div className="col-span-full sm:col-span-1">
                      <Label htmlFor={`car-name-${item.id}`}>Car Name</Label>
                      <Input
                        id={`car-name-${item.id}`}
                        type="text"
                        value={item.carName}
                        onChange={(e) => updateCarPrice(item.id, "carName", e.target.value)}
                        placeholder="Eg: Swift/Etios"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`rp-price-${item.id}`}>R.Pe Price</Label>
                      <Input
                        id={`rp-price-${item.id}`}
                        type="text"
                        value={item.rpPrice}
                        onChange={(e) => updateCarPrice(item.id, "rpPrice", e.target.value)}
                        placeholder="₹ 2500"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`telan-price-${item.id}`}>TELAN Price</Label>
                      <Input
                        id={`telan-price-${item.id}`}
                        type="text"
                        value={item.telanPrice}
                        onChange={(e) => updateCarPrice(item.id, "telanPrice", e.target.value)}
                        placeholder="₹ 3000"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`bang-price-${item.id}`}>BANG Price</Label>
                      <Input
                        id={`bang-price-${item.id}`}
                        type="text"
                        value={item.bangPrice}
                        onChange={(e) => updateCarPrice(item.id, "bangPrice", e.target.value)}
                        placeholder="₹ 3500"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`pondi-price-${item.id}`}>PONDI Price</Label>
                      <Input
                        id={`pondi-price-${item.id}`}
                        type="text"
                        value={item.pondiPrice}
                        onChange={(e) => updateCarPrice(item.id, "pondiPrice", e.target.value)}
                        placeholder="₹ 2800"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeCarPrice(item.id)}
                      className="col-span-full sm:col-span-1"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addCarPrice} className="mt-3">
                  Add Car
                </Button>
              </div>
            </div>

            {/* Sections */}
            <div>
              <h4 className="heading text-lg font-semibold mb-2">Sections</h4>
              <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                {sections.map((item) => (
                  <div key={item.id} className="flex flex-col gap-2">
                    <div>
                      <Label htmlFor={`section-title-${item.id}`}>Section Title</Label>
                      <Input
                        id={`section-title-${item.id}`}
                        type="text"
                        value={item.title}
                        onChange={(e) => updateSection(item.id, "title", e.target.value)}
                        placeholder="Eg: About This Package"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`section-content-${item.id}`}>Section Content (HTML)</Label>
                      <textarea
                        id={`section-content-${item.id}`}
                        value={item.content}
                        onChange={(e) => updateSection(item.id, "content", e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                        placeholder="Enter section content (HTML allowed)"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSection(item.id)}
                      className="self-end"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addSection} className="mt-3">
                  Add Section
                </Button>
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h4 className="heading text-lg font-semibold mb-2">FAQ :</h4>
              <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                {faqs.map((item) => (
                  <div key={item.id} className="flex flex-col gap-2">
                    <div>
                      <Label htmlFor={`faq-question-${item.id}`}>Question</Label>
                      <Input
                        id={`faq-question-${item.id}`}
                        type="text"
                        value={item.question}
                        onChange={(e) => updateFaq(item.id, "question", e.target.value)}
                        placeholder="Eg: What is included in the package?"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`faq-answer-${item.id}`}>Answer</Label>
                      <textarea
                        id={`faq-answer-${item.id}`}
                        value={item.answer}
                        onChange={(e) => updateFaq(item.id, "answer", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                        placeholder="Enter the answer to the FAQ"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFaq(item.id)}
                      className="self-end"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addFaq} className="mt-3">
                  Add FAQ
                </Button>
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? "Saving..." : isEditMode ? "Update Package" : "Save Package"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2 bg-transparent"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function for display titles (can be moved to a utility file if needed elsewhere)
const getDisplayTitle = (slug) => {
  switch (slug) {
    case "tirupati-package":
      return "Tirupati Package"
    case "temple-package":
      return "Temple Tour Package"
    case "carrental-package":
      return "Car Rental Package"
    default:
      return "Package"
  }
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { X } from 'lucide-react'
import { isAuthenticated } from "@/lib/custom-auth"
import { Switch } from "@/components/ui/switch"

// Helper to generate unique IDs for dynamic fields
const generateUniqueId = () => Math.random().toString(36).substring(2, 15)

export default function CarRentalPackageForm({ packageId }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDirty, setIsDirty] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  // Core package fields
  const [packageUrl, setPackageUrl] = useState("")
  const [title, setTitle] = useState("")
  const [packageOrder, setPackageOrder] = useState(1)
  const [subtitle, setSubtitle] = useState("")
  const [content, setContent] = useState("")

  // Image management
  const [images, setImages] = useState([])
  const [newImageFiles, setNewImageFiles] = useState([])

  // Car rental-specific sections
  const [carTypes, setCarTypes] = useState([])
  const [serviceFeatures, setServiceFeatures] = useState([])
  const [pricingPlans, setPricingPlans] = useState([])
  const [termsAndConditions, setTermsAndConditions] = useState([])
  const [faqs, setFaqs] = useState([])
  const [isActive, setIsActive] = useState(true)

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [clientAuthenticated, setClientAuthenticated] = useState(false)

  const isEditMode = !!packageId

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

  // Handle beforeunload event for browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty && !isNavigating) {
        const message = "You have unsaved changes. Are you sure you want to leave? All changes will be lost."
        e.preventDefault()
        e.returnValue = message
        return message
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isDirty, isNavigating])

  // Custom navigation handler
  const handleNavigation = useCallback((callback) => {
    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave? All changes will be lost."
      )
      if (confirmed) {
        setIsNavigating(true)
        setIsDirty(false)
        callback()
      }
    } else {
      callback()
    }
  }, [isDirty])

  useEffect(() => {
    if (isEditMode && clientAuthenticated) {
      const fetchPackage = async () => {
        try {
          const docRef = doc(db, "carRentalPackages", packageId)
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            const data = docSnap.data()
            setPackageUrl(packageId)
            setTitle(data.title || "")
            setPackageOrder(data.order || 1)
            setImages(data.images || [])
            setCarTypes(
              data.carTypes?.map((car) => ({
                ...car,
                imageFile: null,
              })) || [],
            )
            setServiceFeatures(data.serviceFeatures || [])
            setPricingPlans(
              data.pricingPlans?.map((plan) => ({
                ...plan,
                features: plan.features || [],
              })) || [],
            )
            setTermsAndConditions(data.termsAndConditions || [])
            setFaqs(data.faqs || [])
            setSubtitle(data.subtitle || "")
            setContent(data.content || "")
            setIsActive(data.isActive !== undefined ? data.isActive : true)
          } else {
            toast({
              title: "Error",
              description: "Car rental package not found.",
              variant: "destructive",
            })
            router.push("/admin/car-rental-package")
          }
        } catch (err) {
          console.error("Error fetching car rental package for edit:", err)
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
      setInitialLoading(false)
    }
  }, [packageId, isEditMode, router, toast, clientAuthenticated])

  const handleFileChange = (e) => {
    if (e.target.files) {
      setNewImageFiles((prev) => [...prev, ...Array.from(e.target.files)])
      setIsDirty(true)
    }
  }

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
    setIsDirty(true)
  }

  const removeExistingImage = (urlToRemove) => {
    setImages((prev) => prev.filter((url) => url !== urlToRemove))
    setIsDirty(true)
  }

  // Generic add/remove for simple text points
  const addPoint = (setter) => {
    setter((prev) => [...prev, { id: generateUniqueId(), text: "" }])
    setIsDirty(true)
  }
  const updatePoint = (setter, id, newText) => {
    setter((prev) => prev.map((item) => (item.id === id ? { ...item, text: newText } : item)))
    setIsDirty(true)
  }
  const removePoint = (setter, id) => {
    setter((prev) => prev.filter((item) => item.id !== id))
    setIsDirty(true)
  }

  // Car Types handlers
  const addCarType = () => {
    setCarTypes((prev) => [...prev, { 
      id: generateUniqueId(), 
      name: "", 
      seating: "", 
      fuelType: "", 
      transmission: "", 
      features: "", 
      imageUrl: "", 
      imageFile: null 
    }])
    setIsDirty(true)
  }

  const updateCarTypeField = (carId, field, value) => {
    setCarTypes((prev) => prev.map((car) => (car.id === carId ? { ...car, [field]: value } : car)))
    setIsDirty(true)
  }

  const handleCarTypeImageFileChange = (carId, file) => {
    setCarTypes((prev) => prev.map((car) => (car.id === carId ? { ...car, imageFile: file } : car)))
    setIsDirty(true)
  }

  const removeCarTypeImage = (carId) => {
    setCarTypes((prev) => prev.map((car) => (car.id === carId ? { ...car, imageUrl: "", imageFile: null } : car)))
    setIsDirty(true)
  }

  const removeCarType = (id) => {
    setCarTypes((prev) => prev.filter((item) => item.id !== id))
    setIsDirty(true)
  }

  // Pricing Plans handlers
  const addPricingPlan = () => {
    setPricingPlans((prev) => [...prev, { 
      id: generateUniqueId(), 
      duration: "", 
      price: "", 
      features: [] 
    }])
    setIsDirty(true)
  }

  const updatePricingPlanField = (planId, field, value) => {
    setPricingPlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, [field]: value } : plan)))
    setIsDirty(true)
  }

  const addFeatureToPlan = (planId) => {
    setPricingPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? { ...plan, features: [...plan.features, { id: generateUniqueId(), text: "" }] }
          : plan,
      ),
    )
    setIsDirty(true)
  }

  const updateFeatureInPlan = (planId, featureId, newText) => {
    setPricingPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              features: plan.features.map((feature) => (feature.id === featureId ? { ...feature, text: newText } : feature)),
            }
          : plan,
      ),
    )
    setIsDirty(true)
  }

  const removeFeatureFromPlan = (planId, featureId) => {
    setPricingPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? { ...plan, features: plan.features.filter((feature) => feature.id !== featureId) }
          : plan,
      ),
    )
    setIsDirty(true)
  }

  const removePricingPlan = (id) => {
    setPricingPlans((prev) => prev.filter((item) => item.id !== id))
    setIsDirty(true)
  }

  // FAQs handlers
  const addFaq = () => {
    setFaqs((prev) => [...prev, { id: generateUniqueId(), question: "", answer: "" }])
    setIsDirty(true)
  }
  const updateFaq = (id, field, value) => {
    setFaqs((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    setIsDirty(true)
  }
  const removeFaq = (id) => {
    setFaqs((prev) => prev.filter((item) => item.id !== id))
    setIsDirty(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!packageUrl) {
      toast({
        title: "Validation Error",
        description: "Package URL is required.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      // Upload main package images to Firebase Storage
      const uploadedImageUrls = []
      const folderName =
        packageUrl
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "untitled-package"
      const storagePathPrefix = `car-rental-packages/${folderName}`

      for (const file of newImageFiles) {
        const imageRef = ref(storage, `${storagePathPrefix}/${file.name}`)
        await uploadBytes(imageRef, file)
        const url = await getDownloadURL(imageRef)
        uploadedImageUrls.push(url)
      }

      // Combine existing main images with newly uploaded ones
      const allImageUrls = [...images, ...uploadedImageUrls]

      // Process car types, including image uploads for each car
      const processedCarTypes = await Promise.all(
        carTypes.map(async (car) => {
          let carImageUrl = car.imageUrl
          if (car.imageFile) {
            const carImageRef = ref(storage, `${storagePathPrefix}/cars/${car.imageFile.name}`)
            await uploadBytes(carImageRef, car.imageFile)
            carImageUrl = await getDownloadURL(carImageRef)
          }
          return {
            id: car.id,
            name: car.name,
            seating: car.seating,
            fuelType: car.fuelType,
            transmission: car.transmission,
            features: car.features,
            imageUrl: carImageUrl,
          }
        }),
      )

      // Prepare car rental package data
      const packageData = {
        url: packageUrl,
        title,
        order: packageOrder,
        images: allImageUrls,
        carTypes: processedCarTypes,
        serviceFeatures,
        pricingPlans,
        termsAndConditions,
        faqs,
        subtitle,
        content,
        isActive,
        createdAt: isEditMode ? (await getDoc(doc(db, "carRentalPackages", packageId))).data().createdAt : Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      // Save/Update document in Firestore using packageUrl as document ID
      const docRef = doc(db, "carRentalPackages", packageUrl)
      await setDoc(docRef, packageData)

      toast({
        title: "Success! 🎉",
        description: isEditMode ? "Car rental package updated successfully." : "New car rental package added successfully.",
        variant: "default",
      })

      setIsDirty(false) // Clear dirty state after successful save
      setIsNavigating(true) // Allow navigation
      router.push("/admin/car-rental-package")
    } catch (err) {
      console.error("Error saving car rental package:", err)
      toast({
        title: "Error ❌",
        description: `Failed to save car rental package: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!clientAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Checking authentication...</p>
      </div>
    )
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading car rental package form...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            {isEditMode ? "Edit Car Rental Package" : "Add New Car Rental Package"}
          </CardTitle>
          {isDirty && (
            <div className="text-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                ● Unsaved Changes
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Package URL */}
            <div>
              <Label htmlFor="packageUrl">
                Package URL<span className="text-red-500">*</span>
              </Label>
              <Input
                id="packageUrl"
                type="text"
                value={packageUrl}
                onChange={(e) => {
                  setPackageUrl(e.target.value)
                  setIsDirty(true)
                }}
                required
                placeholder="Eg: premium-car-rental"
                disabled={isEditMode}
              />
              {isEditMode && <p className="text-sm text-gray-500 mt-1">URL cannot be changed after creation.</p>}
            </div>

            {/* Package Title */}
            <div>
              <Label htmlFor="title">
                Package Title<span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setIsDirty(true)
                }}
                required
                placeholder="Eg: Premium Car Rental Service"
              />
            </div>

            {/* Package Order */}
            <div>
              <Label htmlFor="packageOrder">
                Package Order<span className="text-red-500">*</span>
              </Label>
              <Input
                id="packageOrder"
                type="number"
                min="1"
                value={packageOrder}
                onChange={(e) => {
                  setPackageOrder(Number(e.target.value))
                  setIsDirty(true)
                }}
                required
                placeholder="Enter Package Order"
              />
            </div>

            {/* Subtitle */}
            <div>
              <Label htmlFor="subtitle">Package Subtitle</Label>
              <Input
                id="subtitle"
                type="text"
                value={subtitle}
                onChange={(e) => {
                  setSubtitle(e.target.value)
                  setIsDirty(true)
                }}
                placeholder="Brief description of the car rental service"
              />
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">Package Description</Label>
              <textarea
                id="content"
                rows="4"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                  setIsDirty(true)
                }}
                placeholder="Detailed description of the car rental service..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              />
            </div>

            {/* Package Images */}
            <div>
              <Label htmlFor="images">
                Package Images<span className="text-red-500">*</span>
              </Label>
              <Input id="images" type="file" multiple onChange={handleFileChange} className="cursor-pointer" />
              <p className="text-sm text-gray-500 mt-1">Upload multiple images for this car rental package.</p>

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

            {/* Car Types */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Car Types</h4>
              <div className="space-y-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                {carTypes.map((car) => (
                  <div key={car.id} className="border border-gray-300 p-4 rounded-md bg-white relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeCarType(car.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove car type</span>
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`car-name-${car.id}`}>Car Name</Label>
                        <Input
                          id={`car-name-${car.id}`}
                          type="text"
                          value={car.name}
                          onChange={(e) => updateCarTypeField(car.id, "name", e.target.value)}
                          placeholder="Eg: Swift Dzire"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`car-seating-${car.id}`}>Seating Capacity</Label>
                        <Input
                          id={`car-seating-${car.id}`}
                          type="text"
                          value={car.seating}
                          onChange={(e) => updateCarTypeField(car.id, "seating", e.target.value)}
                          placeholder="Eg: 4+1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`car-fuel-${car.id}`}>Fuel Type</Label>
                        <select
                          id={`car-fuel-${car.id}`}
                          value={car.fuelType}
                          onChange={(e) => updateCarTypeField(car.id, "fuelType", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Fuel Type</option>
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                          <option value="CNG">CNG</option>
                          <option value="Electric">Electric</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor={`car-transmission-${car.id}`}>Transmission</Label>
                        <select
                          id={`car-transmission-${car.id}`}
                          value={car.transmission}
                          onChange={(e) => updateCarTypeField(car.id, "transmission", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Transmission</option>
                          <option value="Manual">Manual</option>
                          <option value="Automatic">Automatic</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <Label htmlFor={`car-image-${car.id}`}>Car Image</Label>
                      <Input
                        id={`car-image-${car.id}`}
                        type="file"
                        onChange={(e) => handleCarTypeImageFileChange(car.id, e.target.files[0])}
                        className="cursor-pointer"
                      />
                    </div>

                    {/* Display car image */}
                    {(car.imageUrl || car.imageFile) && (
                      <div className="mb-4">
                        <img
                          src={car.imageFile ? URL.createObjectURL(car.imageFile) : car.imageUrl || "/placeholder.svg"}
                          alt={`${car.name} image`}
                          width={200}
                          height={150}
                          className="rounded-md object-cover w-48 h-32"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCarTypeImage(car.id)}
                          className="mt-2"
                        >
                          Remove Image
                        </Button>
                      </div>
                    )}

                    {/* Car Features */}
                    <div>
                      <Label htmlFor={`car-features-${car.id}`}>Features</Label>
                      <textarea
                        id={`car-features-${car.id}`}
                        rows="3"
                        value={car.features}
                        onChange={(e) => updateCarTypeField(car.id, "features", e.target.value)}
                        placeholder="List car features (AC, GPS, etc.)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addCarType} className="mt-3">
                  Add Car Type
                </Button>
              </div>
            </div>

            {/* Service Features */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Service Features</h4>
              <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                {serviceFeatures.map((item) => (
                  <div key={item.id} className="flex gap-2 items-end">
                    <Input
                      type="text"
                      value={item.text}
                      onChange={(e) => updatePoint(setServiceFeatures, item.id, e.target.value)}
                      placeholder="Eg: 24/7 Customer Support"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePoint(setServiceFeatures, item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => addPoint(setServiceFeatures)} className="mt-3">
                  Add Service Feature
                </Button>
              </div>
            </div>

            {/* Pricing Plans */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Pricing Plans</h4>
              <div className="space-y-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                {pricingPlans.map((plan) => (
                  <div key={plan.id} className="border border-gray-300 p-4 rounded-md bg-white relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removePricingPlan(plan.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove pricing plan</span>
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`plan-duration-${plan.id}`}>Duration</Label>
                        <Input
                          id={`plan-duration-${plan.id}`}
                          type="text"
                          value={plan.duration}
                          onChange={(e) => updatePricingPlanField(plan.id, "duration", e.target.value)}
                          placeholder="Eg: Per Day, Per Week"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`plan-price-${plan.id}`}>Price</Label>
                        <Input
                          id={`plan-price-${plan.id}`}
                          type="text"
                          value={plan.price}
                          onChange={(e) => updatePricingPlanField(plan.id, "price", e.target.value)}
                          placeholder="Eg: ₹ 1500"
                        />
                      </div>
                    </div>

                    {/* Plan Features */}
                    <div>
                      <Label>Plan Features</Label>
                      <div className="space-y-2 mt-2">
                        {plan.features.map((feature) => (
                          <div key={feature.id} className="flex gap-2 items-end">
                            <Input
                              type="text"
                              value={feature.text}
                              onChange={(e) => updateFeatureInPlan(plan.id, feature.id, e.target.value)}
                              placeholder="Eg: Free fuel"
                              className="flex-grow"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFeatureFromPlan(plan.id, feature.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button type="button" onClick={() => addFeatureToPlan(plan.id)} size="sm">
                          Add Feature
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addPricingPlan} className="mt-3">
                  Add Pricing Plan
                </Button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Terms and Conditions</h4>
              <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                {termsAndConditions.map((item) => (
                  <div key={item.id} className="flex gap-2 items-end">
                    <Input
                      type="text"
                      value={item.text}
                      onChange={(e) => updatePoint(setTermsAndConditions, item.id, e.target.value)}
                      placeholder="Eg: Valid driving license required"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePoint(setTermsAndConditions, item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => addPoint(setTermsAndConditions)} className="mt-3">
                  Add Term
                </Button>
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Frequently Asked Questions</h4>
              <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-300 p-4 rounded-md bg-white relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeFaq(faq.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove FAQ</span>
                    </Button>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`faq-question-${faq.id}`}>Question</Label>
                        <Input
                          id={`faq-question-${faq.id}`}
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateFaq(faq.id, "question", e.target.value)}
                          placeholder="Eg: What documents are required?"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`faq-answer-${faq.id}`}>Answer</Label>
                        <textarea
                          id={`faq-answer-${faq.id}`}
                          rows="3"
                          value={faq.answer}
                          onChange={(e) => updateFaq(faq.id, "answer", e.target.value)}
                          placeholder="Provide a detailed answer..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addFaq} className="mt-3">
                  Add FAQ
                </Button>
              </div>
            </div>

            {/* Is Active */}
            <div className="flex items-center space-x-2 mt-6">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => {
                  setIsActive(checked)
                  setIsDirty(true)
                }}
              />
              <Label htmlFor="isActive">Package is Active</Label>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                {loading ? "Saving..." : isEditMode ? "Update Car Rental Package" : "Save Car Rental Package"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => handleNavigation(() => router.back())}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

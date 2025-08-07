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

// Helper function to clean empty fields from objects and arrays
const cleanEmptyFields = (data) => {
  if (Array.isArray(data)) {
    return data
      .map(item => cleanEmptyFields(item))
      .filter(item => {
        if (typeof item === 'string') return item.trim() !== ''
        if (typeof item === 'object' && item !== null) {
          const cleanedItem = Object.fromEntries(
            Object.entries(item).filter(([key, value]) => {
              if (typeof value === 'string') return value.trim() !== ''
              if (Array.isArray(value)) return value.length > 0
              return value !== null && value !== undefined
            })
          )
          return Object.keys(cleanedItem).length > 0
        }
        return item !== null && item !== undefined
      })
  }
  
  if (typeof data === 'object' && data !== null) {
    const cleaned = {}
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        if (value.trim() !== '') cleaned[key] = value.trim()
      } else if (Array.isArray(value)) {
        const cleanedArray = cleanEmptyFields(value)
        if (cleanedArray.length > 0) cleaned[key] = cleanedArray
      } else if (typeof value === 'object' && value !== null) {
        const cleanedObject = cleanEmptyFields(value)
        if (Object.keys(cleanedObject).length > 0) cleaned[key] = cleanedObject
      } else if (value !== null && value !== undefined && value !== '') {
        cleaned[key] = value
      }
    }
    return cleaned
  }
  
  return data
}

// Helper function to ensure arrays have proper structure when fetching
const ensureArrayStructure = (data, defaultStructure = { id: generateUniqueId(), text: "" }) => {
  if (!Array.isArray(data)) return []
  
  return data.map(item => {
    if (typeof item === 'string') {
      return { id: generateUniqueId(), text: item }
    }
    if (typeof item === 'object' && item !== null) {
      return { id: item.id || generateUniqueId(), ...item }
    }
    return defaultStructure
  }).filter(item => {
    // Filter out items where all values are empty
    const values = Object.values(item).filter(val => val !== 'id')
    return values.some(val => val && val.toString().trim() !== '')
  })
}

export default function TemplePackageForm({ packageId }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDirty, setIsDirty] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  // Core package fields
  const [packageUrl, setPackageUrl] = useState("")
  const [title, setTitle] = useState("")
  const [packageOrder, setPackageOrder] = useState(1)
  const [tripDays, setTripDays] = useState("1")
  const [subtitle, setSubtitle] = useState("")
  const [content, setContent] = useState("")

  // Image management
  const [images, setImages] = useState([])
  const [newImageFiles, setNewImageFiles] = useState([])

  // Temple-specific sections
  const [templeList, setTempleList] = useState([])
  const [tourHighlights, setTourHighlights] = useState([])
  const [includes, setIncludes] = useState([])
  const [excludes, setExcludes] = useState([])
  const [itineraries, setItineraries] = useState([])
  const [importantNotes, setImportantNotes] = useState([])
  const [faqs, setFaqs] = useState([])
  const [isActive, setIsActive] = useState(true)
  const [carPrices, setCarPrices] = useState([])
  const [sections, setSections] = useState([])
  const [sightseeingPlaces, setSightseeingPlaces] = useState([])

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
          const docRef = doc(db, "templePackages", packageId)
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            const data = docSnap.data()
            
            // Set basic fields with empty string fallback
            setPackageUrl(packageId)
            setTitle(data.title || "")
            setPackageOrder(data.order || 1)
            setTripDays(data.days || "1")
            setSubtitle(data.subtitle || "")
            setContent(data.content || "")
            setIsActive(data.isActive !== undefined ? data.isActive : true)
            
            // Set images array, filter out empty strings
            setImages((data.images || []).filter(img => img && img.trim() !== ''))
            
            // Set temple list with proper structure
            setTempleList(
              ensureArrayStructure(data.templeList || [], {
                id: generateUniqueId(),
                name: "",
                description: "",
                imageUrl: "",
                imageFile: null
              }).map(temple => ({
                ...temple,
                imageFile: null,
              }))
            )
            
            // Set other arrays with proper structure
            setTourHighlights(ensureArrayStructure(data.tourHighlights || []))
            setIncludes(ensureArrayStructure(data.includes || []))
            setExcludes(ensureArrayStructure(data.excludes || []))
            setItineraries(ensureArrayStructure(data.itineraries || []))
            setImportantNotes(ensureArrayStructure(data.importantNotes || []))
            
            // Set FAQs with proper structure
            setFaqs(
              ensureArrayStructure(data.faqs || [], {
                id: generateUniqueId(),
                question: "",
                answer: ""
              })
            )
            
            // Set car prices with proper structure
            setCarPrices(
              ensureArrayStructure(data.carPrices || [], {
                id: generateUniqueId(),
                carType: "",
                price: ""
              })
            )
            
            // Set sections with proper structure
            setSections(
              ensureArrayStructure(data.sections || [], {
                id: generateUniqueId(),
                title: "",
                content: ""
              })
            )
            
            // Set sightseeing places with proper structure
            setSightseeingPlaces(
              ensureArrayStructure(data.sightseeingPlaces || [], {
                id: generateUniqueId(),
                name: "",
                description: ""
              })
            )
            
          } else {
            toast({
              title: "Error",
              description: "Temple package not found.",
              variant: "destructive",
            })
            router.push("/admin/temple-package")
          }
        } catch (err) {
          console.error("Error fetching temple package for edit:", err)
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

  // Temple List handlers
  const addTemple = () => {
    setTempleList((prev) => [...prev, { id: generateUniqueId(), name: "", description: "", imageUrl: "", imageFile: null }])
    setIsDirty(true)
  }

  const updateTempleField = (templeId, field, value) => {
    setTempleList((prev) => prev.map((temple) => (temple.id === templeId ? { ...temple, [field]: value } : temple)))
    setIsDirty(true)
  }

  const handleTempleImageFileChange = (templeId, file) => {
    setTempleList((prev) => prev.map((temple) => (temple.id === templeId ? { ...temple, imageFile: file } : temple)))
    setIsDirty(true)
  }

  const removeTempleImage = (templeId) => {
    setTempleList((prev) => prev.map((temple) => (temple.id === templeId ? { ...temple, imageUrl: "", imageFile: null } : temple)))
    setIsDirty(true)
  }

  const removeTemple = (id) => {
    setTempleList((prev) => prev.filter((item) => item.id !== id))
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

  // Car Prices handlers
  const addCarPrice = () => {
    setCarPrices((prev) => [...prev, { id: generateUniqueId(), carType: "", price: "" }]);
    setIsDirty(true);
  };

  const updateCarPrice = (id, field, value) => {
    setCarPrices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    setIsDirty(true);
  };

  const removeCarPrice = (id) => {
    setCarPrices((prev) => prev.filter((item) => item.id !== id));
    setIsDirty(true);
  };

  // Sections handlers
  const addSection = () => {
    setSections((prev) => [...prev, { id: generateUniqueId(), title: "", content: "" }]);
    setIsDirty(true);
  };

  const updateSection = (id, field, value) => {
    setSections((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    setIsDirty(true);
  };

  const removeSection = (id) => {
    setSections((prev) => prev.filter((item) => item.id !== id));
    setIsDirty(true);
  };

  // Sightseeing Places handlers
  const addSightseeingPlace = () => {
    setSightseeingPlaces((prev) => [...prev, { id: generateUniqueId(), name: "", description: "" }]);
    setIsDirty(true);
  };

  const updateSightseeingPlace = (id, field, value) => {
    setSightseeingPlaces((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    setIsDirty(true);
  };

  const removeSightseeingPlace = (id) => {
    setSightseeingPlaces((prev) => prev.filter((item) => item.id !== id));
    setIsDirty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate required fields
    if (!packageUrl || packageUrl.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Package URL is required.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (!title || title.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Package title is required.",
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
      const storagePathPrefix = `temple-packages/${folderName}`

      for (const file of newImageFiles) {
        const imageRef = ref(storage, `${storagePathPrefix}/${file.name}`)
        await uploadBytes(imageRef, file)
        const url = await getDownloadURL(imageRef)
        uploadedImageUrls.push(url)
      }

      // Combine existing main images with newly uploaded ones, filter empty strings
      const allImageUrls = [...images, ...uploadedImageUrls].filter(url => url && url.trim() !== '')

      // Process temple list, including image uploads for each temple
      const processedTempleList = await Promise.all(
        templeList.map(async (temple) => {
          // Skip temples with empty names
          if (!temple.name || temple.name.trim() === '') {
            return null
          }

          let templeImageUrl = temple.imageUrl || ""
          if (temple.imageFile) {
            const templeImageRef = ref(storage, `${storagePathPrefix}/temples/${temple.imageFile.name}`)
            await uploadBytes(templeImageRef, temple.imageFile)
            templeImageUrl = await getDownloadURL(templeImageRef)
          }

          const processedTemple = {
            id: temple.id,
            name: temple.name.trim(),
          }

          // Only add description if it's not empty
          if (temple.description && temple.description.trim() !== '') {
            processedTemple.description = temple.description.trim()
          }

          // Only add imageUrl if it's not empty
          if (templeImageUrl && templeImageUrl.trim() !== '') {
            processedTemple.imageUrl = templeImageUrl.trim()
          }

          return processedTemple
        }),
      )

      // Filter out null temples (those with empty names)
      const validTempleList = processedTempleList.filter(temple => temple !== null)

      // Prepare temple package data - only include non-empty fields
      const packageData = {
        url: packageUrl.trim(),
        title: title.trim(),
        order: packageOrder,
        days: tripDays,
        isActive,
        createdAt: isEditMode ? (await getDoc(doc(db, "templePackages", packageId))).data().createdAt : Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      // Only add optional fields if they have content
      if (subtitle && subtitle.trim() !== '') {
        packageData.subtitle = subtitle.trim()
      }

      if (content && content.trim() !== '') {
        packageData.content = content.trim()
      }

      if (allImageUrls.length > 0) {
        packageData.images = allImageUrls
      }

      if (validTempleList.length > 0) {
        packageData.templeList = validTempleList
      }

      // Clean and add array fields only if they have valid content
      const cleanedTourHighlights = cleanEmptyFields(tourHighlights)
      if (cleanedTourHighlights.length > 0) {
        packageData.tourHighlights = cleanedTourHighlights
      }

      const cleanedIncludes = cleanEmptyFields(includes)
      if (cleanedIncludes.length > 0) {
        packageData.includes = cleanedIncludes
      }

      const cleanedExcludes = cleanEmptyFields(excludes)
      if (cleanedExcludes.length > 0) {
        packageData.excludes = cleanedExcludes
      }

      const cleanedItineraries = cleanEmptyFields(itineraries)
      if (cleanedItineraries.length > 0) {
        packageData.itineraries = cleanedItineraries
      }

      const cleanedImportantNotes = cleanEmptyFields(importantNotes)
      if (cleanedImportantNotes.length > 0) {
        packageData.importantNotes = cleanedImportantNotes
      }

      const cleanedFaqs = cleanEmptyFields(faqs)
      if (cleanedFaqs.length > 0) {
        packageData.faqs = cleanedFaqs
      }

      const cleanedCarPrices = cleanEmptyFields(carPrices)
      if (cleanedCarPrices.length > 0) {
        packageData.carPrices = cleanedCarPrices
      }

      const cleanedSections = cleanEmptyFields(sections)
      if (cleanedSections.length > 0) {
        packageData.sections = cleanedSections
      }

      const cleanedSightseeingPlaces = cleanEmptyFields(sightseeingPlaces)
      if (cleanedSightseeingPlaces.length > 0) {
        packageData.sightseeingPlaces = cleanedSightseeingPlaces
      }

      // Save/Update document in Firestore using packageUrl as document ID
      const docRef = doc(db, "templePackages", packageUrl)
      await setDoc(docRef, packageData)

      toast({
        title: "Success! 🎉",
        description: isEditMode ? "Temple package updated successfully." : "New temple package added successfully.",
        variant: "default",
      })

      setIsDirty(false) // Clear dirty state after successful save
      setIsNavigating(true) // Allow navigation
      router.push("/admin/temple-package")
    } catch (err) {
      console.error("Error saving temple package:", err)
      toast({
        title: "Error ❌",
        description: `Failed to save temple package: ${err.message}`,
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
        <p className="text-lg text-gray-700">Loading temple package form...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            {isEditMode ? "Edit Temple Package" : "Add New Temple Package"}
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
                placeholder="Eg: south-india-temple-tour"
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
                placeholder="Eg: South India Temple Tour Package"
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

            {/* Trip Days */}
            <div>
              <Label htmlFor="tripDays">
                Trip Days<span className="text-red-500">*</span>
              </Label>
              <select
                id="tripDays"
                value={tripDays}
                onChange={(e) => {
                  setTripDays(e.target.value)
                  setIsDirty(true)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                required
              >
                <option value="1">One Day</option>
                <option value="2">Two Days</option>
                <option value="3">Three Days</option>
                <option value="4">Four Days</option>
                <option value="5">Five Days</option>
                <option value="7">One Week</option>
              </select>
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
                placeholder="Brief description of the temple tour"
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
                placeholder="Detailed description of the temple tour package..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              />
            </div>

            {/* Package Images */}
            <div>
              <Label htmlFor="images">Package Images</Label>
              <Input id="images" type="file" multiple onChange={handleFileChange} className="cursor-pointer" />
              <p className="text-sm text-gray-500 mt-1">Upload multiple images for this temple package.</p>

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

            {/* Temple List */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Temple List</h4>
              <div className="space-y-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                {templeList.map((temple) => (
                  <div key={temple.id} className="border border-gray-300 p-4 rounded-md bg-white relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeTemple(temple.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove temple</span>
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`temple-name-${temple.id}`}>Temple Name</Label>
                        <Input
                          id={`temple-name-${temple.id}`}
                          type="text"
                          value={temple.name}
                          onChange={(e) => updateTempleField(temple.id, "name", e.target.value)}
                          placeholder="Eg: Meenakshi Temple"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`temple-image-${temple.id}`}>Temple Image</Label>
                        <Input
                          id={`temple-image-${temple.id}`}
                          type="file"
                          onChange={(e) => handleTempleImageFileChange(temple.id, e.target.files[0])}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Display temple image */}
                    {(temple.imageUrl || temple.imageFile) && (
                      <div className="mb-4">
                        <img
                          src={temple.imageFile ? URL.createObjectURL(temple.imageFile) : temple.imageUrl || "/placeholder.svg"}
                          alt={`${temple.name} image`}
                          width={200}
                          height={150}
                          className="rounded-md object-cover w-48 h-32"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTempleImage(temple.id)}
                          className="mt-2"
                        >
                          Remove Image
                        </Button>
                      </div>
                    )}

                    {/* Temple Description */}
                    <div>
                      <Label htmlFor={`temple-description-${temple.id}`}>Temple Description</Label>
                      <textarea
                        id={`temple-description-${temple.id}`}
                        rows="3"
                        value={temple.description}
                        onChange={(e) => updateTempleField(temple.id, "description", e.target.value)}
                        placeholder="Brief description of the temple..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addTemple} className="mt-3">
                  Add Temple
                </Button>
              </div>
            </div>

            {/* Tour Highlights */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Tour Highlights</h4>
              <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                {tourHighlights.map((item) => (
                  <div key={item.id} className="flex gap-2 items-end">
                    <Input
                      type="text"
                      value={item.text}
                      onChange={(e) => updatePoint(setTourHighlights, item.id, e.target.value)}
                      placeholder="Eg: Visit ancient Dravidian architecture"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePoint(setTourHighlights, item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => addPoint(setTourHighlights)} className="mt-3">
                  Add Highlight
                </Button>
              </div>
            </div>

            {/* Package Includes */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Package Includes</h4>
              <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                {includes.map((item) => (
                  <div key={item.id} className="flex gap-2 items-end">
                    <Input
                      type="text"
                      value={item.text}
                      onChange={(e) => updatePoint(setIncludes, item.id, e.target.value)}
                      placeholder="Eg: Temple entry fees"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePoint(setIncludes, item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => addPoint(setIncludes)} className="mt-3">
                  Add Include Point
                </Button>
              </div>
            </div>

            {/* Package Excludes */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Package Excludes</h4>
              <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                {excludes.map((item) => (
                  <div key={item.id} className="flex gap-2 items-end">
                    <Input
                      type="text"
                      value={item.text}
                      onChange={(e) => updatePoint(setExcludes, item.id, e.target.value)}
                      placeholder="Eg: Personal expenses"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePoint(setExcludes, item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => addPoint(setExcludes)} className="mt-3">
                  Add Exclude Point
                </Button>
              </div>
            </div>

            {/* Package Itinerary */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Package Itinerary</h4>
              <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                {itineraries.map((item) => (
                  <div key={item.id} className="flex gap-2 items-end">
                    <Input
                      type="text"
                      value={item.text}
                      onChange={(e) => updatePoint(setItineraries, item.id, e.target.value)}
                      placeholder="Eg: Day 1: Visit Meenakshi Temple"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePoint(setItineraries, item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => addPoint(setItineraries)} className="mt-3">
                  Add Itinerary Point
                </Button>
              </div>
            </div>

            {/* Important Notes */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Important Notes</h4>
              <div className="space-y-2 p-4 bg-gray-50 rounded-md border border-gray-200">
                {importantNotes.map((item) => (
                  <div key={item.id} className="flex gap-2 items-end">
                    <Input
                      type="text"
                      value={item.text}
                      onChange={(e) => updatePoint(setImportantNotes, item.id, e.target.value)}
                      placeholder="Eg: Dress code must be followed"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePoint(setImportantNotes, item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => addPoint(setImportantNotes)} className="mt-3">
                  Add Important Note
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
                          placeholder="Eg: What is the temple dress code?"
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

            {/* Car Prices */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Car Prices</h4>
              <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                {carPrices.map((carPrice) => (
                  <div key={carPrice.id} className="border border-gray-300 p-4 rounded-md bg-white relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeCarPrice(carPrice.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove Car Price</span>
                    </Button>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`car-type-${carPrice.id}`}>Car Type</Label>
                        <Input
                          id={`car-type-${carPrice.id}`}
                          type="text"
                          value={carPrice.carType}
                          onChange={(e) => updateCarPrice(carPrice.id, "carType", e.target.value)}
                          placeholder="Eg: Sedan, SUV"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`car-price-${carPrice.id}`}>Price</Label>
                        <Input
                          id={`car-price-${carPrice.id}`}
                          type="number"
                          value={carPrice.price}
                          onChange={(e) => updateCarPrice(carPrice.id, "price", e.target.value)}
                          placeholder="Enter price"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addCarPrice} className="mt-3">
                  Add Car Price
                </Button>
              </div>
            </div>

            {/* Sections */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Sections</h4>
              <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                {sections.map((section) => (
                  <div key={section.id} className="border border-gray-300 p-4 rounded-md bg-white relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeSection(section.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove Section</span>
                    </Button>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`section-title-${section.id}`}>Title</Label>
                        <Input
                          id={`section-title-${section.id}`}
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(section.id, "title", e.target.value)}
                          placeholder="Eg: Overview"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`section-content-${section.id}`}>Content</Label>
                        <textarea
                          id={`section-content-${section.id}`}
                          rows="3"
                          value={section.content}
                          onChange={(e) => updateSection(section.id, "content", e.target.value)}
                          placeholder="Enter content..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addSection} className="mt-3">
                  Add Section
                </Button>
              </div>
            </div>

            {/* Sightseeing Places */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Sightseeing Places</h4>
              <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                {sightseeingPlaces.map((place) => (
                  <div key={place.id} className="border border-gray-300 p-4 rounded-md bg-white relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeSightseeingPlace(place.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove Sightseeing Place</span>
                    </Button>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`place-name-${place.id}`}>Name</Label>
                        <Input
                          id={`place-name-${place.id}`}
                          type="text"
                          value={place.name}
                          onChange={(e) => updateSightseeingPlace(place.id, "name", e.target.value)}
                          placeholder="Eg: Meenakshi Temple"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`place-description-${place.id}`}>Description</Label>
                        <textarea
                          id={`place-description-${place.id}`}
                          rows="3"
                          value={place.description}
                          onChange={(e) => updateSightseeingPlace(place.id, "description", e.target.value)}
                          placeholder="Enter description..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addSightseeingPlace} className="mt-3">
                  Add Sightseeing Place
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
                {loading ? "Saving..." : isEditMode ? "Update Temple Package" : "Save Temple Package"}
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

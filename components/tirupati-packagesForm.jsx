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
import { X } from 'lucide-react'
import { isAuthenticated } from "@/lib/custom-auth" // Import custom auth check

// Helper to generate unique IDs for dynamic fields
const generateUniqueId = () => Math.random().toString(36).substring(2, 15)

export default function PackageForm({ packageType, packageId }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDirty, setIsDirty] = useState(false)

  // Core package fields
  const [packageUrl, setPackageUrl] = useState("") // New: Used as document ID
  const [title, setTitle] = useState("")
  const [packageOrder, setPackageOrder] = useState(1) // New: Package Order
  const [tripDays, setTripDays] = useState("1") // New: Trip Days

  // Image management
  const [images, setImages] = useState([]) // Stores URLs of existing images
  const [newImageFiles, setNewImageFiles] = useState([]) // Stores File objects for new uploads

  // Dynamic sections
  const [packagesAndCars, setPackagesAndCars] = useState([]) // Array of { id, packageName, cars: [{ id, carName, seatCapacity, price }] }
  const [includes, setIncludes] = useState([])
  const [itineraries, setItineraries] = useState([])
  const [passengerNotes, setPassengerNotes] = useState([]) // Corresponds to 'notes' in HTML
  const [sightseeingPlaces, setSightseeingPlaces] = useState([]) // Array of { id, text, imageUrl, imageFile }
  // Updated structure for carPrices
  const [carPrices, setCarPrices] = useState([]) // Array of { id, carName, imageUrl, imageFile, prices: [{ id, label, value }] }
  const [sections, setSections] = useState([]) // Array of { id, hasImage, imageUrl, imageFile, contentTitle, contentDescription, listInfo: [{ id, text }] }
  const [faqs, setFaqs] = useState([]) // Corresponds to 'faq' in HTML
  const [whyChooseUsItems, setWhyChooseUsItems] = useState([])

  const [maleDressCodeImages, setMaleDressCodeImages] = useState([]) // Stores URLs of existing male dress code images
  const [newMaleDressCodeFiles, setNewMaleDressCodeFiles] = useState([]) // Stores File objects for new male dress code uploads
  const [femaleDressCodeImages, setFemaleDressCodeImages] = useState([]) // Stores URLs of existing female dress code images
  const [newFemaleDressCodeFiles, setNewFemaleDressCodeFiles] = useState([]) // Stores File objects for new female dress code uploads

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
          title: "Authentication ",
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
            setSightseeingPlaces(
              data.sightseeingPlaces?.map((place) => ({
                ...place,
                imageFile: null, // No file on initial load
              })) || [],
            )
            // Map existing carPrices to include new image/prices fields
            setCarPrices(
              data.carPrices?.map((car) => ({
                ...car,
                imageFile: null, // No file on initial load
                prices: car.prices || [],
                includes: car.includes || "", // Load new includes field
                excludes: car.excludes || "", // Load new excludes field
              })) || [],
            )
            // Map existing sections to include new image/listInfo fields
            setSections(
              data.sections?.map((s) => ({
                ...s,
                hasImage: !!s.imageUrl, // Assume if imageUrl exists, it has an image
                imageFile: null, // No file on initial load
                listInfo: s.listInfo || [],
              })) || [],
            )
            setFaqs(data.faqs || [])
            // Filter out description when loading existing items
            setWhyChooseUsItems(
              data.whyChooseUsItems?.map((item) => ({
                id: item.id,
                iconName: item.iconName,
                title: item.title,
              })) || [],
            )
            setMaleDressCodeImages(data.maleDressCodeImages || [])
            setNewMaleDressCodeFiles([]) // Clear any pending new files on load
            setFemaleDressCodeImages(data.femaleDressCodeImages || [])
            setNewFemaleDressCodeFiles([]) // Clear any pending new files on load
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

  // --- Dynamic Field Handlers ---

  // Generic add/remove for simple text points (includes, itineraries, notes, places)
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

  // Packages and Cars (nested structure)
  const addPackageEntry = () => {
    setPackagesAndCars((prev) => [...prev, { id: generateUniqueId(), packageName: "", cars: [] }])
    setIsDirty(true)
  }

  const updatePackageName = (packageIdToUpdate, newName) => {
    setPackagesAndCars((prev) =>
      prev.map((pkg) => (pkg.id === packageIdToUpdate ? { ...pkg, packageName: newName } : pkg)),
    )
    setIsDirty(true)
  }

  const removePackageEntry = (packageIdToRemove) => {
    setPackagesAndCars((prev) => prev.filter((pkg) => pkg.id !== packageIdToRemove))
    setIsDirty(true)
  }

  const addCarToPackage = (packageIdToUpdate) => {
    setPackagesAndCars((prev) =>
      prev.map((pkg) =>
        pkg.id === packageIdToUpdate
          ? { ...pkg, cars: [...pkg.cars, { id: generateUniqueId(), carName: "", seatCapacity: "", price: "" }] }
          : pkg,
      ),
    )
    setIsDirty(true)
  }

  const updateCarInPackage = (packageIdToUpdate, carIdToUpdate, field, value) => {
    setPackagesAndCars((prev) =>
      prev.map((pkg) =>
        pkg.id === packageIdToUpdate
          ? {
              ...pkg,
              cars: pkg.cars.map((car) => (car.id === carIdToUpdate ? { ...car, [field]: value } : car)),
            }
          : pkg,
      ),
    )
    setIsDirty(true)
  }

  const removeCarFromPackage = (packageIdToUpdate, carIdToRemove) => {
    setPackagesAndCars((prev) =>
      prev.map((pkg) =>
        pkg.id === packageIdToUpdate ? { ...pkg, cars: pkg.cars.filter((car) => car.id !== carIdToRemove) } : pkg,
      ),
    )
    setIsDirty(true)
  }

  // Car Prices (updated handlers for nested structure)
  const addCarPriceEntry = () => {
    setCarPrices((prev) => [
      ...prev,
      {
        id: generateUniqueId(),
        carName: "",
        imageUrl: "",
        imageFile: null,
        prices: [{ id: generateUniqueId(), label: "1 person", value: "" }],
        includes: "", // Initialize new includes field
        excludes: "", // Initialize new excludes field
      },
    ])
    setIsDirty(true)
  }

  const updateCarPriceField = (carId, field, value) => {
    setCarPrices((prev) => prev.map((car) => (car.id === carId ? { ...car, [field]: value } : car)))
    setIsDirty(true)
  }

  const handleCarImageFileChange = (carId, file) => {
    setCarPrices((prev) => prev.map((car) => (car.id === carId ? { ...car, imageFile: file } : car)))
    setIsDirty(true)
  }

  const removeCarImage = (carId) => {
    setCarPrices((prev) => prev.map((car) => (car.id === carId ? { ...car, imageUrl: "", imageFile: null } : car)))
    setIsDirty(true)
  }

  const addPriceToCar = (carId) => {
    setCarPrices((prev) =>
      prev.map((car) =>
        car.id === carId ? { ...car, prices: [...car.prices, { id: generateUniqueId(), label: "", value: "" }] } : car,
      ),
    )
    setIsDirty(true)
  }

  const updatePriceInCar = (carId, priceId, field, value) => {
    setCarPrices((prev) =>
      prev.map((car) =>
        car.id === carId
          ? {
              ...car,
              prices: car.prices.map((price) => (price.id === priceId ? { ...price, [field]: value } : price)),
            }
          : car,
      ),
    )
    setIsDirty(true)
  }

  const removePriceFromCar = (carId, priceId) => {
    setCarPrices((prev) =>
      prev.map((car) =>
        car.id === carId ? { ...car, prices: car.prices.filter((price) => price.id !== priceId) } : car,
      ),
    )
    setIsDirty(true)
  }

  const removeCarPriceEntry = (id) => {
    setCarPrices((prev) => prev.filter((item) => item.id !== id))
    setIsDirty(true)
  }

  // Sightseeing Places (new handlers for image and text)
  const addSightseeingPlace = () => {
    setSightseeingPlaces((prev) => [...prev, { id: generateUniqueId(), text: "", imageUrl: "", imageFile: null }])
    setIsDirty(true)
  }

  const updateSightseeingPlaceField = (placeId, field, value) => {
    setSightseeingPlaces((prev) => prev.map((place) => (place.id === placeId ? { ...place, [field]: value } : place)))
    setIsDirty(true)
  }

  const handleSightseeingPlaceImageFileChange = (placeId, file) => {
    setSightseeingPlaces((prev) => prev.map((place) => (place.id === placeId ? { ...place, imageFile: file } : place)))
    setIsDirty(true)
  }

  const removeSightseeingPlaceImage = (placeId) => {
    setSightseeingPlaces((prev) =>
      prev.map((place) => (place.id === placeId ? { ...place, imageUrl: "", imageFile: null } : place)),
    )
    setIsDirty(true)
  }

  const removeSightseeingPlace = (id) => {
    setSightseeingPlaces((prev) => prev.filter((item) => item.id !== id))
    setIsDirty(true)
  }

  // Dress Code Image Handlers
  const handleMaleDressCodeFileChange = (e) => {
    if (e.target.files) {
      setNewMaleDressCodeFiles((prev) => [...prev, ...Array.from(e.target.files)])
      setIsDirty(true)
    }
  }

  const removeNewMaleDressCodeImage = (index) => {
    setNewMaleDressCodeFiles((prev) => prev.filter((_, i) => i !== index))
    setIsDirty(true)
  }

  const removeExistingMaleDressCodeImage = (urlToRemove) => {
    setMaleDressCodeImages((prev) => prev.filter((url) => url !== urlToRemove))
    setIsDirty(true)
  }

  const handleFemaleDressCodeFileChange = (e) => {
    if (e.target.files) {
      setNewFemaleDressCodeFiles((prev) => [...prev, ...Array.from(e.target.files)])
      setIsDirty(true)
    }
  }

  const removeNewFemaleDressCodeImage = (index) => {
    setNewFemaleDressCodeFiles((prev) => prev.filter((_, i) => i !== index))
    setIsDirty(true)
  }

  const removeExistingFemaleDressCodeImage = (urlToRemove) => {
    setFemaleDressCodeImages((prev) => prev.filter((url) => url !== urlToRemove))
    setIsDirty(true)
  }

  // Sections (updated handlers for nested structure)
  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: generateUniqueId(),
        hasImage: false,
        imageUrl: "",
        imageFile: null,
        contentTitle: "",
        contentDescription: "",
        listInfo: [],
      },
    ])
    setIsDirty(true)
  }

  const updateSectionField = (sectionId, field, value) => {
    setSections((prev) => prev.map((section) => (section.id === sectionId ? { ...section, [field]: value } : section)))
    setIsDirty(true)
  }

  const handleSectionImageFileChange = (sectionId, file) => {
    setSections((prev) => prev.map((section) => (section.id === sectionId ? { ...section, imageFile: file } : section)))
    setIsDirty(true)
  }

  const removeSectionImage = (sectionId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, imageUrl: "", imageFile: null, hasImage: false } : section,
      ),
    )
    setIsDirty(true)
  }

  const addListInfoToSection = (sectionId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, listInfo: [...section.listInfo, { id: generateUniqueId(), text: "" }] }
          : section,
      ),
    )
    setIsDirty(true)
  }

  const updateListInfoInSection = (sectionId, listInfoId, newText) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              listInfo: section.listInfo.map((item) => (item.id === listInfoId ? { ...item, text: newText } : item)),
            }
          : section,
      ),
    )
    setIsDirty(true)
  }

  const removeListInfoFromSection = (sectionId, listInfoId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, listInfo: section.listInfo.filter((item) => item.id !== listInfoId) }
          : section,
      ),
    )
    setIsDirty(true)
  }

  const removeSection = (id) => {
    setSections((prev) => prev.filter((item) => item.id !== id))
    setIsDirty(true)
  }

  // Why Choose Us Handlers
  const addWhyChooseUsItem = () => {
    setWhyChooseUsItems((prev) => [...prev, { id: generateUniqueId(), iconName: "", title: "" }])
    setIsDirty(true)
  }

  const updateWhyChooseUsItem = (id, field, value) => {
    setWhyChooseUsItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    setIsDirty(true)
  }

  const removeWhyChooseUsItem = (id) => {
    setWhyChooseUsItems((prev) => prev.filter((item) => item.id !== id))
    setIsDirty(true)
  }

  // FAQs (e.g., { question: "Q?", answer: "A." })
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

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    const handleRouteChange = (url) => {
      if (isDirty && !confirm("Are you sure you want to move back without saving?")) {
        throw "Abort route change" // cancel navigation
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    router.events?.on("routeChangeStart", handleRouteChange)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      router.events?.off("routeChangeStart", handleRouteChange)
    }
  }, [isDirty, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    console.log("Form submission started.")

    if (!packageUrl) {
      toast({
        title: "Validation Error",
        description: "Package URL is .",
        variant: "destructive",
      })
      setLoading(false)
      console.error("Validation failed: Package URL is empty.")
      return
    }

    try {
      // 1. Upload main package images to Firebase Storage
      const uploadedImageUrls = []
      const folderName =
        packageUrl
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "untitled-package"
      const storagePathPrefix = `${packageType}/${folderName}`
      console.log(`Storage path prefix for main images: ${storagePathPrefix}`)

      for (const file of newImageFiles) {
        console.log(`Attempting to upload main file: ${file.name}`)
        const imageRef = ref(storage, `${storagePathPrefix}/${file.name}`)
        await uploadBytes(imageRef, file)
        const url = await getDownloadURL(imageRef)
        uploadedImageUrls.push(url)
        console.log(`Uploaded ${file.name}, URL: ${url}`)
      }

      // Combine existing main images with newly uploaded ones
      const allImageUrls = [...images, ...uploadedImageUrls]
      console.log("All main image URLs (existing + new):", allImageUrls)

      // 2. Process car prices, including image uploads for each car
      const processedCarPrices = await Promise.all(
        carPrices.map(async (car) => {
          let carImageUrl = car.imageUrl // Start with existing URL
          if (car.imageFile) {
            // Only upload if a new file is selected
            const carImageRef = ref(storage, `${storagePathPrefix}/cars/${car.imageFile.name}`)
            await uploadBytes(carImageRef, car.imageFile)
            carImageUrl = await getDownloadURL(carImageRef)
            console.log(`Uploaded car image ${car.imageFile.name}, URL: ${carImageUrl}`)
          }
          return {
            id: car.id,
            carName: car.carName,
            imageUrl: carImageUrl, // Store the final image URL
            prices: car.prices,
            includes: car.includes, // Include new includes field
            excludes: car.excludes, // Include new excludes field
          }
        }),
      )
      console.log("Processed car prices:", processedCarPrices)

      // New: Process sightseeing places, including image uploads for each place
      const processedSightseeingPlaces = await Promise.all(
        sightseeingPlaces.map(async (place) => {
          let placeImageUrl = place.imageUrl // Start with existing URL
          if (place.imageFile) {
            // Only upload if a new file is selected
            const placeImageRef = ref(storage, `${storagePathPrefix}/places/${place.imageFile.name}`)
            await uploadBytes(placeImageRef, place.imageFile)
            placeImageUrl = await getDownloadURL(placeImageRef)
            console.log(`Uploaded sightseeing place image ${place.imageFile.name}, URL: ${placeImageUrl}`)
          }
          return {
            id: place.id,
            text: place.text,
            imageUrl: placeImageUrl, // Store the final image URL
          }
        }),
      )
      console.log("Processed sightseeing places:", processedSightseeingPlaces)

      // New: Process male dress code images
      const uploadedMaleDressCodeUrls = []
      for (const file of newMaleDressCodeFiles) {
        console.log(`Attempting to upload male dress code file: ${file.name}`)
        const imageRef = ref(storage, `${storagePathPrefix}/dress-code/male/${file.name}`)
        await uploadBytes(imageRef, file)
        const url = await getDownloadURL(imageRef)
        uploadedMaleDressCodeUrls.push(url)
        console.log(`Uploaded male dress code image ${file.name}, URL: ${url}`)
      }
      const allMaleDressCodeUrls = [...maleDressCodeImages, ...uploadedMaleDressCodeUrls]
      console.log("All male dress code image URLs (existing + new):", allMaleDressCodeUrls)

      // New: Process female dress code images
      const uploadedFemaleDressCodeUrls = []
      for (const file of newFemaleDressCodeFiles) {
        console.log(`Attempting to upload female dress code file: ${file.name}`)
        const imageRef = ref(storage, `${storagePathPrefix}/dress-code/female/${file.name}`)
        await uploadBytes(imageRef, file)
        const url = await getDownloadURL(imageRef)
        uploadedFemaleDressCodeUrls.push(url)
        console.log(`Uploaded female dress code image ${file.name}, URL: ${url}`)
      }
      const allFemaleDressCodeUrls = [...femaleDressCodeImages, ...uploadedFemaleDressCodeUrls]
      console.log("All female dress code image URLs (existing + new):", allFemaleDressCodeUrls)

      // 3. Process sections, including image uploads for each section
      const processedSections = await Promise.all(
        sections.map(async (section) => {
          let sectionImageUrl = section.imageUrl // Start with existing URL
          if (section.hasImage && section.imageFile) {
            // Only upload if hasImage is true and a new file is selected
            const sectionImageRef = ref(storage, `${storagePathPrefix}/sections/${section.imageFile.name}`)
            await uploadBytes(sectionImageRef, section.imageFile)
            sectionImageUrl = await getDownloadURL(sectionImageRef)
            console.log(`Uploaded section image ${section.imageFile.name}, URL: ${sectionImageUrl}`)
          } else if (!section.hasImage) {
            // If hasImage is false, clear the image URL
            sectionImageUrl = ""
          }
          return {
            id: section.id,
            contentTitle: section.contentTitle,
            contentDescription: section.contentDescription,
            imageUrl: sectionImageUrl, // Store the final image URL
            listInfo: section.listInfo,
          }
        }),
      )
      console.log("Processed sections:", processedSections)

      // 4. Prepare package data
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
        sightseeingPlaces: processedSightseeingPlaces,
        carPrices: processedCarPrices, // Use the processed car prices
        sections: processedSections, // Use the processed sections
        faqs,
        whyChooseUsItems, // Save the updated whyChooseUsItems
        maleDressCodeImages: allMaleDressCodeUrls,
        femaleDressCodeImages: allFemaleDressCodeUrls,
        createdAt: isEditMode ? (await getDoc(doc(db, packageType, packageId))).data().createdAt : Timestamp.now(),
        updatedAt: Timestamp.now(),
      }
      console.log("Prepared package data:", packageData)

      // 5. Save/Update document in Firestore using packageUrl as document ID
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

    setIsDirty(false)
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
                placeholder="Eg: chennai-to-tirupati"
                disabled={isEditMode} // URL should not be editable in edit mode
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
                placeholder="Eg: Chennai to Tirupati"
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
              >
                <option value="1">One Day</option>
                <option value="2">Two Days</option>
              </select>
            </div>

            {/* Package Image */}
            <div>
              <Label htmlFor="images">
                Package Image<span className="text-red-500">*</span>
              </Label>
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

            {/* Packages and Cars (Updated Nested Structure) */}
            <div>
              <h4 className="heading text-lg font-semibold mb-2">Packages and Cars</h4>
              <div className="space-y-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                {packagesAndCars.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-300 p-4 rounded-md bg-white relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removePackageEntry(pkg.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove package</span>
                    </Button>
                    <div className="mb-4">
                      <Label htmlFor={`package-name-${pkg.id}`}>Package Name</Label>
                      <Input
                        id={`package-name-${pkg.id}`}
                        type="text"
                        value={pkg.packageName}
                        onChange={(e) => {
                          updatePackageName(pkg.id, e.target.value)
                          setIsDirty(true)
                        }}
                        placeholder="Eg: Standard Package"
                        className="w-full"
                      />
                    </div>

                    <h5 className="text-md font-semibold mb-2">Cars for this Package:</h5>
                    <div className="space-y-3 mb-4">
                      {pkg.cars.map((car) => (
                        <div key={car.id} className="flex flex-col sm:flex-row gap-2 items-end">
                          <div className="flex-1">
                            <Label htmlFor={`car-name-${car.id}`}>Car Name</Label>
                            <Input
                              id={`car-name-${car.id}`}
                              type="text"
                              value={car.carName}
                              onChange={(e) => {
                                updateCarInPackage(pkg.id, car.id, "carName", e.target.value)
                                setIsDirty(true)
                              }}
                              placeholder="Eg: Swift"
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor={`seat-capacity-${car.id}`}>Seat Capacity</Label>
                            <Input
                              id={`seat-capacity-${car.id}`}
                              type="text"
                              value={car.seatCapacity}
                              onChange={(e) => {
                                updateCarInPackage(pkg.id, car.id, "seatCapacity", e.target.value)
                                setIsDirty(true)
                              }}
                              placeholder="Eg: 6+1"
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor={`car-price-${car.id}`}>Price</Label>
                            <Input
                              id={`car-price-${car.id}`}
                              type="text"
                              value={car.price}
                              onChange={(e) => {
                                updateCarInPackage(pkg.id, car.id, "price", e.target.value)
                                setIsDirty(true)
                              }}
                              placeholder="Eg: ₹ 1200"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeCarFromPackage(pkg.id, car.id)}
                          >
                            Remove Car
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button type="button" onClick={() => addCarToPackage(pkg.id)} className="mt-2">
                      Add Car
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addPackageEntry} className="mt-3">
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
                      onChange={(e) => {
                        updatePoint(setIncludes, item.id, e.target.value)
                        setIsDirty(true)
                      }}
                      placeholder="Eg: Driver Allowance"
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
                      onChange={(e) => {
                        updatePoint(setItineraries, item.id, e.target.value)
                        setIsDirty(true)
                      }}
                      placeholder="Eg: Day 1: Chennai to Tirupati"
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
                      onChange={(e) => {
                        updatePoint(setPassengerNotes, item.id, e.target.value)
                        setIsDirty(true)
                      }}
                      placeholder="Eg: Carry valid ID proof"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePoint(setPassengerNotes, item.id)}
                    >
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
                      <span className="sr-only">Remove place</span>
                    </Button>

                    {/* Place Name and Image */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <div className="flex-1">
                        <Label htmlFor={`place-name-${place.id}`}>Place Name</Label>
                        <Input
                          id={`place-name-${place.id}`}
                          type="text"
                          value={place.text}
                          onChange={(e) => {
                            updateSightseeingPlaceField(place.id, "text", e.target.value)
                            setIsDirty(true)
                          }}
                          placeholder="Enter Name"
                          className="w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`place-image-${place.id}`}>Choose Image</Label>
                        <Input
                          id={`place-image-${place.id}`}
                          type="file"
                          onChange={(e) => {
                            handleSightseeingPlaceImageFileChange(place.id, e.target.files[0])
                            setIsDirty(true)
                          }}
                          className="cursor-pointer"
                        />
                        {(place.imageUrl || place.imageFile) && (
                          <div className="mt-2 relative group w-24 h-16">
                            <img
                              src={place.imageFile ? URL.createObjectURL(place.imageFile) : place.imageUrl}
                              alt="Place image preview"
                              width={96}
                              height={64}
                              className="rounded-md object-cover w-full h-full"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-0 right-0 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeSightseeingPlaceImage(place.id)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove place image</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addSightseeingPlace} className="mt-3">
                  Add Place
                </Button>
              </div>
            </div>

            {/* Dress Code */}
            <div>
              <h4 className="heading text-lg font-semibold mb-2">Dress Code</h4>
              <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Male Dress Code */}
                  <div className="border border-gray-300 p-4 rounded-md bg-white">
                    <h5 className="text-md font-semibold mb-2 text-center">Male</h5>
                    <Label htmlFor="male-dress-code-image">Choose Image</Label>
                    <Input
                      id="male-dress-code-image"
                      type="file"
                      multiple
                      onChange={handleMaleDressCodeFileChange}
                      className="cursor-pointer"
                    />
                    {newMaleDressCodeFiles.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {newMaleDressCodeFiles.map((file, index) => (
                          <div key={index} className="relative group w-24 h-16">
                            <img
                              src={URL.createObjectURL(file) || "/placeholder.svg"}
                              alt={`New male dress code image ${index + 1}`}
                              width={96}
                              height={64}
                              className="rounded-md object-cover w-full h-full"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-0 right-0 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeNewMaleDressCodeImage(index)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove image</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {maleDressCodeImages.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {maleDressCodeImages.map((url, index) => (
                          <div key={index} className="relative group w-24 h-16">
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Existing male dress code image ${index + 1}`}
                              width={96}
                              height={64}
                              className="rounded-md object-cover w-full h-full"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-0 right-0 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeExistingMaleDressCodeImage(url)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove image</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Female Dress Code */}
                  <div className="border border-gray-300 p-4 rounded-md bg-white">
                    <h5 className="text-md font-semibold mb-2 text-center">Female</h5>
                    <Label htmlFor="female-dress-code-image">Choose Image</Label>
                    <Input
                      id="female-dress-code-image"
                      type="file"
                      multiple
                      onChange={handleFemaleDressCodeFileChange}
                      className="cursor-pointer"
                    />
                    {newFemaleDressCodeFiles.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {newFemaleDressCodeFiles.map((file, index) => (
                          <div key={index} className="relative group w-24 h-16">
                            <img
                              src={URL.createObjectURL(file) || "/placeholder.svg"}
                              alt={`New female dress code image ${index + 1}`}
                              width={96}
                              height={64}
                              className="rounded-md object-cover w-full h-full"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-0 right-0 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeNewFemaleDressCodeImage(index)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove image</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {femaleDressCodeImages.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {femaleDressCodeImages.map((url, index) => (
                          <div key={index} className="relative group w-24 h-16">
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Existing female dress code image ${index + 1}`}
                              width={96}
                              height={64}
                              className="rounded-md object-cover w-full h-full"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-0 right-0 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeExistingFemaleDressCodeImage(url)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove image</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Car Prices (Updated Nested Structure) */}
            <div>
              <h4 className="heading text-lg font-semibold mb-2">Car Prices</h4>
              <div className="space-y-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                {carPrices.map((car) => (
                  <div key={car.id} className="border border-gray-300 p-4 rounded-md bg-white relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeCarPriceEntry(car.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove car</span>
                    </Button>

                    {/* Car Name and Image */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <div className="flex-1">
                        <Label htmlFor={`car-name-${car.id}`}>Enter Car Name</Label>
                        <Input
                          id={`car-name-${car.id}`}
                          type="text"
                          value={car.carName}
                          onChange={(e) => {
                            updateCarPriceField(car.id, "carName", e.target.value)
                            setIsDirty(true)
                          }}
                          placeholder="Eg: Swift/Etios"
                          className="w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`car-image-${car.id}`}>Choose Image</Label>
                        <Input
                          id={`car-image-${car.id}`}
                          type="file"
                          onChange={(e) => {
                            handleCarImageFileChange(car.id, e.target.files[0])
                            setIsDirty(true)
                          }}
                          className="cursor-pointer"
                        />
                        {(car.imageUrl || car.imageFile) && (
                          <div className="mt-2 relative group w-24 h-16">
                            <img
                              src={car.imageFile ? URL.createObjectURL(car.imageFile) : car.imageUrl}
                              alt="Car image preview"
                              width={96}
                              height={64}
                              className="rounded-md object-cover w-full h-full"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-0 right-0 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeCarImage(car.id)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove car image</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Includes Field */}
                    <div className="mb-4">
                      <Label htmlFor={`car-includes-${car.id}`}>Includes</Label>
                      <textarea
                        id={`car-includes-${car.id}`}
                        value={car.includes}
                        onChange={(e) => {
                          updateCarPriceField(car.id, "includes", e.target.value)
                          setIsDirty(true)
                        }}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                        placeholder="Enter what's included (e.g., Toll, Parking, Driver Allowance)"
                      />
                    </div>

                    {/* Excludes Field */}
                    <div className="mb-4">
                      <Label htmlFor={`car-excludes-${car.id}`}>Excludes</Label>
                      <textarea
                        id={`car-excludes-${car.id}`}
                        value={car.excludes}
                        onChange={(e) => {
                          updateCarPriceField(car.id, "excludes", e.target.value)
                          setIsDirty(true)
                        }}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                        placeholder="Enter what's excluded (e.g., Food, Accommodation)"
                      />
                    </div>

                    {/* Prices for this Car */}
                    <h5 className="text-md font-semibold mb-2">Prices:</h5>
                    <div className="space-y-3 mb-4 p-3 bg-gray-100 rounded-md border border-gray-200">
                      {car.prices.map((price) => (
                        <div key={price.id} className="flex flex-col sm:flex-row gap-2 items-end">
                          <div className="flex-1">
                            <Label htmlFor={`price-label-${price.id}`}>Label</Label>
                            <Input
                              id={`price-label-${price.id}`}
                              type="text"
                              value={price.label}
                              onChange={(e) => {
                                updatePriceInCar(car.id, price.id, "label", e.target.value)
                                setIsDirty(true)
                              }}
                              placeholder="Eg: 1 person"
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor={`price-value-${price.id}`}>Price</Label>
                            <Input
                              id={`price-value-${price.id}`}
                              type="text"
                              value={price.value}
                              onChange={(e) => {
                                updatePriceInCar(car.id, price.id, "value", e.target.value)
                                setIsDirty(true)
                              }}
                              placeholder="Eg: ₹ 1000"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removePriceFromCar(car.id, price.id)}
                          >
                            Remove Price
                          </Button>
                        </div>
                      ))}
                      <Button type="button" onClick={() => addPriceToCar(car.id)} className="mt-2">
                        Add Price
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addCarPriceEntry} className="mt-3">
                  Add Car
                </Button>
              </div>
            </div>

            {/* Sections (Updated Structure) */}
            <div>
              <h4 className="heading text-lg font-semibold mb-2">Sections</h4>
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
                      <span className="sr-only">Remove section</span>
                    </Button>

                    {/* Content Title */}
                    <div className="mb-4">
                      <Label htmlFor={`section-title-${section.id}`}>Content Title</Label>
                      <Input
                        id={`section-title-${section.id}`}
                        type="text"
                        value={section.contentTitle}
                        onChange={(e) => {
                          updateSectionField(section.id, "contentTitle", e.target.value)
                          setIsDirty(true)
                        }}
                        placeholder="Enter content title"
                        className="w-full"
                      />
                    </div>

                    {/* Content Description */}
                    <div className="mb-4">
                      <Label htmlFor={`section-description-${section.id}`}>Content Description (HTML)</Label>
                      <textarea
                        id={`section-description-${section.id}`}
                        value={section.contentDescription}
                        onChange={(e) => {
                          updateSectionField(section.id, "contentDescription", e.target.value)
                          setIsDirty(true)
                        }}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                        placeholder="Enter section content (HTML allowed)"
                      />
                    </div>

                    {/* Want Update Image Checkbox */}
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id={`want-image-${section.id}`}
                        checked={section.hasImage}
                        onChange={(e) => {
                          updateSectionField(section.id, "hasImage", e.target.checked)
                          setIsDirty(true)
                        }}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <Label htmlFor={`want-image-${section.id}`}>Want to add/update Image?</Label>
                    </div>

                    {/* Image Upload and Preview (Conditional) */}
                    {section.hasImage && (
                      <div className="mb-4 p-3 bg-gray-100 rounded-md border border-gray-200">
                        <Label htmlFor={`section-image-${section.id}`}>Choose File</Label>
                        <Input
                          id={`section-image-${section.id}`}
                          type="file"
                          onChange={(e) => {
                            handleSectionImageFileChange(section.id, e.target.files[0])
                            setIsDirty(true)
                          }}
                          className="cursor-pointer"
                        />
                        <p className="text-sm text-gray-500 mt-1">Upload an image for this section.</p>

                        {(section.imageUrl || section.imageFile) && (
                          <div className="mt-4 relative group w-32 h-24">
                            <img
                              src={section.imageFile ? URL.createObjectURL(section.imageFile) : section.imageUrl}
                              alt="Section image preview"
                              width={128}
                              height={96}
                              className="rounded-md object-cover w-full h-full"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeSectionImage(section.id)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove section image</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* List Information */}
                    <h5 className="text-md font-semibold mb-2">List Information</h5>
                    <div className="space-y-2 mb-4 p-3 bg-gray-100 rounded-md border border-gray-200">
                      {section.listInfo.map((item) => (
                        <div key={item.id} className="flex gap-2 items-end">
                          <Input
                            type="text"
                            value={item.text}
                            onChange={(e) => {
                              updateListInfoInSection(section.id, item.id, e.target.value)
                              setIsDirty(true)
                            }}
                            placeholder="Add info point"
                            className="flex-grow"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeListInfoFromSection(section.id, item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button type="button" onClick={() => addListInfoToSection(section.id)} className="mt-2">
                        Add Info
                      </Button>
                    </div>
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
                        onChange={(e) => {
                          updateFaq(item.id, "question", e.target.value)
                          setIsDirty(true)
                        }}
                        placeholder="Eg: What is included in the package?"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`faq-answer-${item.id}`}>Answer</Label>
                      <textarea
                        id={`faq-answer-${item.id}`}
                        value={item.answer}
                        onChange={(e) => {
                          updateFaq(item.id, "answer", e.target.value)
                          setIsDirty(true)
                        }}
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

            {/* Why Choose Us */}
            <div>
              <h4 className="heading text-lg font-semibold mb-2">Why Choose Us Items:</h4>
              <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                {whyChooseUsItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 border border-gray-300 p-4 rounded-md bg-white relative"
                  >
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeWhyChooseUsItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                    <div>
                      <Label htmlFor={`why-us-icon-${item.id}`}>Icon Name (Lucide React)</Label>
                      <Input
                        id={`why-us-icon-${item.id}`}
                        type="text"
                        value={item.iconName}
                        onChange={(e) => {
                          updateWhyChooseUsItem(item.id, "iconName", e.target.value)
                          setIsDirty(true)
                        }}
                        placeholder="Eg: Star, ShieldCheck, Users"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Use names from{" "}
                        <a
                          href="https://lucide.dev/icons/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Lucide React
                        </a>{" "}
                        (e.g., Star, ShieldCheck, Users, Clock, MapPin, Wallet).
                      </p>
                    </div>
                    <div>
                      <Label htmlFor={`why-us-title-${item.id}`}>Title</Label>
                      <Input
                        id={`why-us-title-${item.id}`}
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          updateWhyChooseUsItem(item.id, "title", e.target.value)
                          setIsDirty(true)
                        }}
                        placeholder="Eg: 5-Star Rated Service"
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addWhyChooseUsItem} className="mt-3">
                  Add Why Choose Us Item
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
              onClick={() => {
                if (
                  isDirty &&
                  !confirm("You have unsaved changes. Are you sure you want to leave? All changes will be lost.")
                ) {
                  return
                }
                router.back()
              }}
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

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UnderConstructionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 text-center bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src="/images/Balaji.webp?height=200&width=200"
            alt="Under Construction"
            fill
            style={{ objectFit: "contain" }}
            className="animate-bounce-slow"
          />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Page Under Construction</h1>
        <p className="mt-3 text-lg text-gray-600">
          {"We're currently working on this page to bring you the best experience. Please check back soon for updates."}
        </p>
        <p className="text-md text-gray-700 mb-4">For more information, feel free to contact us directly.</p>
        <a
          href="tel:+919840789844" // replace with your real number
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition"
        >
          📞 Call Us: +91 9840789844
        </a>
        <a
          href="tel:+919840789857" // replace with your real number
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition"
        >
          📞 Call Us: +91 9840789857
        </a>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="w-full sm:w-auto px-6 py-3 text-lg">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

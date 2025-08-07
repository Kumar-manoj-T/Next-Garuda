import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Send, ChevronRight } from 'lucide-react'
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
        <Header />

      <main className="flex-1">
        <section className="bg-red-100 text-black py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <nav className="text-sm text-gray-600 flex justify-center items-center gap-2" aria-label="Breadcrumb">
                        <Link href="/" className="hover:underline text-gray-700 font-medium">
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 font-medium">Contact</span>
                    </nav>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    We're here to help and answer any question you might have. We look forward to hearing from you.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Phone className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">Phone</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-gray-600">+1 (555) 987-6543</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Mail className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-lg">Email</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">info@yourbrand.com</p>
                      <p className="text-gray-600">support@yourbrand.com</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <MapPin className="h-6 w-6 text-red-600" />
                        </div>
                        <CardTitle className="text-lg">Address</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">123 Business Street</p>
                      <p className="text-gray-600">Suite 100</p>
                      <p className="text-gray-600">New York, NY 10001</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Clock className="h-6 w-6 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg">Hours</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Sat: 10:00 AM - 4:00 PM</p>
                      <p className="text-gray-600">Sun: Closed</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Send us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <Input id="firstName" placeholder="John" />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <Input id="lastName" placeholder="Doe" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <Input id="email" type="email" placeholder="john@example.com" />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <Input id="subject" placeholder="How can we help you?" />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <Textarea 
                          id="message" 
                          placeholder="Tell us more about your inquiry..." 
                          rows={5}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
              <p className="text-lg text-gray-600">
                Visit our office or get directions to our location
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 lg:aspect-h-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878459418!3d40.74844097932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sGoogle!5e0!3m2!1sen!2sus!4v1635959592890!5m2!1sen!2sus"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-96 lg:h-[450px]"
                ></iframe>
              </div>
              
              <div className="p-6 bg-gray-50 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">123 Business Street, Suite 100</p>
                      <p className="text-gray-600">New York, NY 10001</p>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <a 
                      href="https://maps.google.com/?q=123+Business+Street,+New+York,+NY+10001" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

    </div>
  )
}

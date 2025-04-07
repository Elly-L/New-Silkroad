"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TeamMember {
  id: number
  name: string
  role: string
  image: string
  experience: string
  strengths: string[]
  bio: string
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Ann Mutua",
    role: "CEO & Co-Founder",
    image: "/images/ann.png",
    experience: "10+ years in e-commerce and retail management",
    strengths: ["Strategic Planning", "Business Development", "Team Leadership"],
    bio: "Ann co-founded NewSilkroad with a vision to connect quality products with discerning customers. With over a decade of experience in retail and e-commerce, she has built the company from the ground up into a trusted marketplace for premium goods that are hard to obtain through traditional channels.",
  },
  {
    id: 2,
    name: "Elly Odhiambo", // Blue top
    role: "CTO & Co-Founder",
    image: "/images/james.png", // C -> A (James's image)
    experience: "8+ years in software development and IT infrastructure",
    strengths: ["Full-Stack Development", "System Architecture", "Cloud Solutions"],
    bio: "Elly oversees all technical aspects of NewSilkroad, from the website infrastructure to payment systems. His expertise in creating seamless digital experiences has been instrumental in the platform's growth and reliability. He is also the founder of El-Tek, a technology company specializing in innovative solutions for e-commerce and digital payments. His background includes extensive experience in software development, cybersecurity, and blockchain technology.",
  },
  {
    id: 3,
    name: "James Nyoro", // Carrying a bag
    role: "Creative Director & Co-Founder",
    image: "/images/kelvin.png", // A -> B (Kelvin's image)
    experience: "7+ years in UI/UX design and brand development",
    strengths: ["Visual Design", "Brand Strategy", "User Experience"],
    bio: "James is the creative force behind NewSilkroad's distinctive visual identity. His keen eye for design and understanding of user behavior has shaped the platform's intuitive interface and engaging brand presence.",
  },
  {
    id: 4,
    name: "Kevin Njuguna", // White t-shirt inside a jacket
    role: "Operations Manager & Co-Founder",
    image: "/images/elly.png", // B -> C (Elly's image)
    experience: "6+ years in supply chain and logistics management",
    strengths: ["Supply Chain Optimization", "Vendor Relations", "Process Improvement"],
    bio: "Kevin ensures that every order on NewSilkroad is processed efficiently and delivered promptly. His expertise in logistics and operations has been key to maintaining customer satisfaction and streamlining business processes.",
  },
  {
    id: 5,
    name: "Emmanuel Katunga",
    role: "Marketing Director & Co-Founder",
    image: "/images/emmanuel.png",
    experience: "5+ years in digital marketing and customer acquisition",
    strengths: ["Digital Marketing", "Content Strategy", "Analytics"],
    bio: "Emmanuel leads NewSilkroad's marketing initiatives, from social media campaigns to email marketing. His data-driven approach and creative strategies have helped the platform reach new audiences and build a loyal customer base.",
  },
]

export default function AboutPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [open, setOpen] = useState(false)

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member)
    setOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Rest of the code remains the same */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Story</h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  NewSilkroad was founded with a simple mission: to connect quality products from around the world with
                  discerning customers in Kenya and beyond.
                </p>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Just as the ancient Silk Road connected East and West, we bridge the gap between artisans,
                  manufacturers, and consumers, bringing unique and high-quality products to your doorstep.
                </p>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Since our founding in 2025, we've specialized in offering legal products that are hard to obtain using
                  established links and traditional commerce platforms, but at a fraction of the price. Our unique
                  network of suppliers allows us to bypass traditional channels and pass the savings directly to you.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[300px] w-full md:h-[400px] lg:h-[500px]">
                  <Image
                    src="/images/yellow-bags.png"
                    alt="Shopping bags arranged in a grid"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Meet Our Team</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The passionate individuals behind NewSilkroad
                </p>
              </div>
            </div>

            {/* Artistic Team Layout */}
            <div className="relative mx-auto max-w-4xl">
              {/* Center Logo */}
              <div className="flex flex-col items-center justify-center mb-12">
                <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-green-600 shadow-lg">
                  <Image src="/images/logo.png" alt="NewSilkroad Logo" fill className="object-cover bg-white p-4" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-green-600">NewSilkroad</h3>
                <p className="text-sm text-gray-500">Est. 2025</p>
              </div>

              {/* Team Members in Circular Pattern */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
                    onClick={() => handleMemberClick(member)}
                  >
                    <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
                      <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                    </div>
                    <div className="mt-4 text-center">
                      <h3 className="font-bold">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0">
                <ScrollArea className="max-h-[90vh]">
                  <div className="p-6">
                    {selectedMember && (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{selectedMember.name}</DialogTitle>
                          <DialogDescription>{selectedMember.role}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-6 md:grid-cols-[300px_1fr]">
                          <div className="space-y-4">
                            <div className="relative aspect-square overflow-hidden rounded-lg">
                              <Image
                                src={selectedMember.image || "/placeholder.svg"}
                                alt={selectedMember.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                              <h4 className="font-semibold">Experience</h4>
                              <p className="text-gray-600">{selectedMember.experience}</p>
                            </div>
                          </div>
                          <div className="space-y-6">
                            <div className="prose max-w-none">
                              <p className="text-lg leading-relaxed">{selectedMember.bio}</p>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-xl font-semibold">Core Strengths</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedMember.strengths.map((strength, index) => (
                                  <div
                                    key={index}
                                    className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-600"
                                  >
                                    {strength}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-xl font-semibold">Vision for NewSilkroad</h4>
                              <p className="text-gray-600">
                                {selectedMember.name} envisions NewSilkroad as the premier destination for unique,
                                high-quality products that are typically difficult to access through traditional retail
                                channels. By leveraging our global network of suppliers, we aim to democratize access to
                                premium goods at competitive prices.
                              </p>
                            </div>

                            {selectedMember.id === 2 && (
                              <div className="space-y-4">
                                <h4 className="text-xl font-semibold">El-Tek Founder</h4>
                                <p className="text-gray-600">
                                  As the founder of El-Tek, Elly has pioneered innovative solutions in e-commerce
                                  technology, focusing on secure payment systems and seamless user experiences. His work
                                  at El-Tek complements the NewSilkroad mission by providing cutting-edge technological
                                  infrastructure for our platform.
                                </p>
                                <Button variant="outline" className="mt-2" asChild>
                                  <a href="https://eltek.netlify.app/about" target="_blank" rel="noopener noreferrer">
                                    View El-Tek Portfolio
                                  </a>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">Our Values</h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="rounded-full bg-green-100 p-2 text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold">Quality</h3>
                      <p className="text-gray-500">
                        We carefully curate our products to ensure they meet the highest standards of quality and
                        craftsmanship.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="rounded-full bg-green-100 p-2 text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold">Accessibility</h3>
                      <p className="text-gray-500">
                        We believe everyone should have access to premium products at reasonable prices, bypassing
                        traditional markup channels.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="rounded-full bg-green-100 p-2 text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold">Customer Service</h3>
                      <p className="text-gray-500">
                        We're committed to providing exceptional service and support at every step of your shopping
                        journey.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[300px] w-full md:h-[400px]">
                  <Image
                    src="/images/plant-vase.png"
                    alt="Minimalist plant in a glass vase"
                    fill
                    className="object-cover rounded-lg"
                  />
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


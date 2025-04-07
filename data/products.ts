export interface Product {
  id: number
  name: string
  price: number
  image: string
  images?: string[]
  category: string
  description: string
  features?: string[]
  specifications?: Record<string, string>
  rating?: number
  reviews?: number
  inStock?: boolean
}

export interface Category {
  id: string
  name: string
}

export const allProducts: Product[] = [
  {
    id: 1,
    name: "Modern Ceramic Vase Set",
    price: 8999,
    image: "/images/modern-vases.png",
    images: ["/images/modern-vases.png", "/images/blue-vase.png", "/images/plant-vase.png"],
    category: "Home Decor",
    description:
      "Elevate your home decor with this elegant ceramic vase set. Perfect for displaying fresh or dried flowers. Each piece is handcrafted by skilled artisans using traditional techniques.",
    features: [
      "Set of 3 vases in varying sizes",
      "Handcrafted from premium ceramic",
      "Unique glazing technique for a distinctive finish",
      "Water-resistant interior",
      "Suitable for fresh or dried flowers",
    ],
    specifications: {
      Material: "Premium ceramic",
      Dimensions: "Small: 15cm x 8cm, Medium: 20cm x 10cm, Large: 25cm x 12cm",
      Weight: "1.8kg (total set)",
      Color: "White with blue accents",
      Care: "Wipe clean with a damp cloth, avoid harsh chemicals",
    },
    rating: 4.9,
    reviews: 42,
    inStock: true,
  },
  {
    id: 2,
    name: "Blue Velvet Dining Chair",
    price: 14999,
    image: "/images/blue-chairs.png",
    images: ["/images/blue-chairs.png", "/images/blue-chairs.png", "/images/blue-chairs.png"],
    category: "Furniture",
    description:
      "Add a touch of luxury to your dining area with these plush blue velvet chairs featuring sturdy black metal legs. The ergonomic design ensures comfort during long dinner conversations.",
    features: [
      "Premium velvet upholstery",
      "Sturdy metal frame with powder coating",
      "Ergonomic backrest design",
      "Foam padding for extra comfort",
      "Non-marking floor protectors",
    ],
    specifications: {
      Material: "Velvet upholstery, metal frame",
      Dimensions: "H: 85cm, W: 50cm, D: 55cm",
      Weight: "6.5kg per chair",
      Color: "Royal blue",
      "Weight Capacity": "150kg",
    },
    rating: 4.7,
    reviews: 36,
    inStock: true,
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    price: 24999,
    image: "/images/office-chair.png",
    category: "Office",
    description:
      "Work in comfort with this ergonomic office chair featuring adjustable height, lumbar support, and breathable mesh back. Designed for professionals who spend long hours at their desk.",
    features: [
      "Adjustable height and armrests",
      "Breathable mesh back for ventilation",
      "Lumbar support for proper posture",
      "360° swivel with smooth-rolling casters",
      "Tilt mechanism with tension control",
    ],
    specifications: {
      Material: "Mesh, high-density foam, nylon frame",
      Dimensions: "H: 110-120cm, W: 65cm, D: 65cm",
      Weight: "12kg",
      Color: "Black",
      "Weight Capacity": "180kg",
    },
    rating: 4.8,
    reviews: 58,
    inStock: true,
  },
  {
    id: 4,
    name: "Porcelain Blue Vase",
    price: 5999,
    image: "/images/blue-vase.png",
    category: "Home Decor",
    description:
      "A beautiful porcelain vase with traditional blue and white design, perfect for adding a classic touch to any room. Each vase is hand-painted by skilled artisans.",
    features: [
      "Hand-painted blue and white design",
      "Made from high-quality porcelain",
      "Glazed interior for water resistance",
      "Stable base prevents tipping",
      "Suitable for fresh or dried arrangements",
    ],
    specifications: {
      Material: "Fine porcelain",
      Dimensions: "H: 30cm, Diameter: 15cm",
      Weight: "1.2kg",
      Color: "White with blue pattern",
      Care: "Hand wash only, avoid abrasive cleaners",
    },
    rating: 4.6,
    reviews: 29,
    inStock: true,
  },
  {
    id: 5,
    name: "Minimalist Coffee Table",
    price: 12999,
    image: "/images/coffee-table.png",
    category: "Furniture",
    description:
      "A sleek, modern coffee table with clean lines and a practical lower shelf for storage. The perfect centerpiece for your living room.",
    features: [
      "Durable engineered wood construction",
      "Scratch-resistant surface",
      "Lower shelf for additional storage",
      "Easy to assemble",
      "Sturdy design with reinforced joints",
    ],
    specifications: {
      Material: "Engineered wood with veneer finish",
      Dimensions: "L: 120cm, W: 60cm, H: 45cm",
      Weight: "18kg",
      Color: "Walnut",
      "Weight Capacity": "50kg",
    },
    rating: 4.5,
    reviews: 32,
    inStock: true,
  },
  {
    id: 6,
    name: "Glass Plant Vase",
    price: 3499,
    image: "/images/plant-vase.png",
    category: "Home Decor",
    description:
      "A simple yet elegant glass vase, perfect for displaying your favorite plants or flowers. The transparent design allows you to see the beautiful stems and water.",
    features: [
      "Made from high-quality clear glass",
      "Versatile design suits any decor style",
      "Wide opening for easy arrangement",
      "Thick base for stability",
      "Suitable for both fresh and artificial arrangements",
    ],
    specifications: {
      Material: "Lead-free glass",
      Dimensions: "H: 25cm, Diameter: 12cm",
      Weight: "0.8kg",
      Color: "Clear",
      Care: "Dishwasher safe",
    },
    rating: 4.4,
    reviews: 21,
    inStock: true,
  },
  {
    id: 7,
    name: "Luxury Marble Dining Table",
    price: 89999,
    image: "/images/dining-table.png",
    category: "Furniture",
    description:
      "Elevate your dining experience with this stunning marble-top dining table featuring an artistic gold base. The perfect statement piece for elegant homes.",
    features: [
      "Genuine marble tabletop",
      "Gold-finished stainless steel base",
      "Unique sculptural design",
      "Scratch and stain-resistant surface",
      "Professional assembly included",
    ],
    specifications: {
      Material: "Marble top, stainless steel base",
      Dimensions: "L: 180cm, W: 90cm, H: 75cm",
      Weight: "85kg",
      Color: "White marble, gold base",
      "Seating Capacity": "6-8 people",
    },
    rating: 4.9,
    reviews: 18,
    inStock: true,
  },
  {
    id: 8,
    name: "Modern Office Desk",
    price: 32999,
    image: "/images/office-desk.png",
    category: "Office",
    description:
      "A contemporary office desk with ample storage and a sleek design. Perfect for home offices or professional environments.",
    features: [
      "Multiple drawers for organization",
      "Cable management system",
      "Scratch-resistant surface",
      "Adjustable shelf in cabinet",
      "Sturdy metal legs with levelers",
    ],
    specifications: {
      Material: "Engineered wood, metal frame",
      Dimensions: "L: 150cm, W: 70cm, H: 76cm",
      Weight: "45kg",
      Color: "Gray",
      "Weight Capacity": "80kg",
    },
    rating: 4.7,
    reviews: 42,
    inStock: true,
  },
  {
    id: 9,
    name: "Premium Home Appliance Set",
    price: 149999,
    image: "/images/home-appliances.png",
    category: "Appliances",
    description:
      "Complete your home with this premium appliance set including refrigerator, washing machine, microwave, and more. Energy-efficient and stylish.",
    features: [
      "Energy Star certified appliances",
      "Smart home compatible",
      "Stainless steel finish",
      "Low noise operation",
      "Extended warranty included",
    ],
    specifications: {
      "Refrigerator Size": "500L double door",
      "Washing Machine": "8kg front load",
      Microwave: "30L convection",
      Color: "Silver/White",
      Warranty: "5 years",
    },
    rating: 4.8,
    reviews: 15,
    inStock: true,
  },
  {
    id: 10,
    name: "Minimalist Bedroom Set",
    price: 129999,
    image: "/images/coffee-table.png", // Using coffee table as placeholder for bedroom set
    category: "Furniture",
    description:
      "Transform your bedroom with this complete minimalist set including bed frame, nightstands, and dresser. Clean lines and modern design for a peaceful retreat.",
    features: [
      "Geometric design elements",
      "Soft-close drawers",
      "Hidden hardware for clean look",
      "Durable white lacquer finish",
      "Includes bed frame, 2 nightstands, and dresser",
    ],
    specifications: {
      Material: "MDF with lacquer finish",
      "Bed Dimensions": "Queen size, 160 x 200cm",
      "Nightstand Dimensions": "45 x 40 x 50cm each",
      "Dresser Dimensions": "120 x 50 x 80cm",
      Color: "White",
    },
    rating: 4.6,
    reviews: 24,
    inStock: true,
  },
  {
    id: 11,
    name: "Outdoor Lounge Set",
    price: 79999,
    image: "/images/outdoor-furniture.png",
    category: "Outdoor",
    description:
      "Create a cozy outdoor living space with this premium lounge set featuring comfortable seating around a stylish fire pit. Perfect for entertaining guests.",
    features: [
      "Weather-resistant materials",
      "Comfortable cushions with removable covers",
      "Natural wood construction",
      "Gas-powered fire pit included",
      "UV-resistant fabric",
    ],
    specifications: {
      Material: "Teak wood, olefin fabric",
      Dimensions: "Seating area: 3m x 3m",
      "Pieces Included": "4 chairs, fire pit, side tables",
      "Weight Capacity": "150kg per chair",
      Warranty: "3 years",
    },
    rating: 4.8,
    reviews: 19,
    inStock: true,
  },
]

export const categories: Category[] = [
  { id: "all", name: "All Products" },
  { id: "furniture", name: "Furniture" },
  { id: "home-decor", name: "Home Decor" },
  { id: "office", name: "Office" },
  { id: "appliances", name: "Appliances" },
  { id: "outdoor", name: "Outdoor" },
]


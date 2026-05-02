/** Placeholder catalog — add your new products here */

export const products = []

export function getProductById(id) {
  return products.find((p) => p.id === id)
}

/** PDP gallery — use explicit `images` when set, else repeat main image for layout demo */
export function getGalleryImages(product) {
  if (!product) return []
  if (product.images?.length) return product.images
  return [product.image, product.image, product.image, product.image].filter(Boolean)
}

export function getRelatedProducts(currentId, limit = 4) {
  return products.filter((p) => p.id !== currentId).slice(0, limit)
}

export const testimonials = [
  {
    quote: "The Emergency Kit gives our family peace of mind. The quality of the supplies and the clear instructions make it invaluable during unexpected situations.",
    author: "Sarah Mensah",
    product: "Premium Family Emergency Kit"
  },
  {
    quote: "As a school administrator, standardizing our safety protocols was a priority. Tobinco's institutional solutions provided exactly what we needed to keep our students safe.",
    author: "Kwame Osei",
    product: "Institutional Safety Solutions"
  },
  {
    quote: "The tele-consultation service was seamless. Having access to medical professionals who understand the contents of the emergency kit gave me immediate clarity.",
    author: "Abena Asamoah",
    product: "Wellness Hub & Consultation"
  }
]

export const team = [
  {
    name: 'Dr. Marcus Adeyemi, MD',
    role: 'Chief Scientific Officer',
    bio: 'Cardiologist and researcher focused on preventive care and population health strategies.',
    image: '/Dr. Marcus Adeyemi (CMO).png',
    objectPosition: 'object-center',
  },
  {
    name: 'Dr. Aisha Williams, MD',
    role: 'Chief Patient Officer',
    bio: 'Internist with a passion for clear communication and evidence-informed wellness education.',
    image: '/Dr. Aisha Williams (CPO).jpg',
    objectPosition: 'object-top', // Focus on face
  },
  {
    name: 'Michael Okoro',
    role: 'Managing Director',
    bio: 'Specializing in pharmaceutical supply chain and community health access across the region.',
    image: '/Michael Okoro (Managing Director).jpg',
    objectPosition: 'object-top',
  },
]

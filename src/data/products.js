/** Placeholder catalog — inspired by wellness / preparedness retail layouts */

export const products = [
  {
    id: 'ultimate-detox',
    name: 'Ultimate Cellular Detox',
    price: 89.99,
    tagline: 'The clinician-designed protocol — now in one bottle.',
    rating: 4.9,
    reviews: 267,
    badge: null,
    image:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    description:
      'A daily formula crafted to support your body’s natural detox pathways with botanicals and targeted nutrients. Placeholder copy for demonstration.',
    highlights: [
      'Third-party tested ingredients',
      'Vegan capsules',
      '30-day supply',
    ],
  },
  {
    id: 'emergency-kit',
    name: 'Medical Emergency Kit',
    price: 299.99,
    tagline: 'Peace of mind in a box.',
    rating: 4.9,
    reviews: 1649,
    badge: 'Best Seller',
    image: '/hero-emergency-kit.png',
    images: [
      '/hero-emergency-kit.png',
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80',
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80',
    ],
    description:
      'A preparedness bundle for households who want structured guidance and professional-grade supplies. All items are placeholders for this demo site.',
    highlights: [
      'Organized by scenario',
      'Printed quick-reference guide',
      'Compact storage case',
    ],
  },
  {
    id: 'dual-cleanse',
    name: 'Dual-Action Digestive Cleanse',
    price: 349.99,
    tagline: 'Support balance with a two-phase approach.',
    rating: 4.9,
    reviews: 106,
    badge: 'Best Seller',
    image:
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
    description:
      'Placeholder product narrative: pairs broad-spectrum botanical support with a gentle maintenance phase. Consult a licensed provider before use.',
    highlights: [
      'Phased protocol',
      'Travel-friendly packaging',
      'Provider consult available',
    ],
  },
  {
    id: 'metabolic-support',
    name: 'Metabolic Support + B-Complex',
    price: 349.99,
    tagline: 'Daily metabolic wellness, simplified.',
    rating: 4.8,
    reviews: 412,
    badge: 'New',
    image:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    description:
      'Demo listing for a dissolvable or capsule format. Not medical advice — this is sample UI content for a React storefront.',
    highlights: [
      'B6 + B12 included',
      'No artificial dyes',
      'Subscription optional',
    ],
  },
  {
    id: 'shield-daily',
    name: 'Shield Daily',
    price: 54.99,
    tagline: 'Your daily shield against everyday stressors.',
    rating: 4.7,
    reviews: 88,
    badge: null,
    image:
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
    description:
      'Antioxidant-forward blend with adaptogens (placeholder). Imagery and claims are for layout only.',
    highlights: ['Morning or evening use', 'Non-GMO', '60 capsules'],
  },
  {
    id: 'recharge-nad',
    name: 'Recharge NAD+',
    price: 79.99,
    tagline: 'Cellular energy with modern cofactors.',
    rating: 4.8,
    reviews: 203,
    badge: null,
    image:
      'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&q=80',
    description:
      'Placeholder science-forward supplement page. Replace with real formulation details in production.',
    highlights: ['NAD+ precursor blend', 'PQQ support', 'Lab tested'],
  },
]

export function getProductById(id) {
  return products.find((p) => p.id === id)
}

/** PDP gallery — use explicit `images` when set, else repeat main image for layout demo */
export function getGalleryImages(product) {
  if (product.images?.length) return product.images
  return [product.image, product.image, product.image, product.image]
}

export function getRelatedProducts(currentId, limit = 4) {
  return products.filter((p) => p.id !== currentId).slice(0, limit)
}

export const testimonials = [
  {
    quote:
      'The emergency kit gave our family a clear plan. Everything is labeled and the guide is easy to follow.',
    author: 'Michael O.',
    product: 'Medical Emergency Kit',
  },
  {
    quote:
      'I noticed better energy within two weeks. Customer support answered my questions quickly.',
    author: 'Terry R.',
    product: 'Ultimate Cellular Detox',
  },
  {
    quote:
      'Focus and stress feel more manageable. I have recommended Tobin Emergency Kit Hub to friends.',
    author: 'H.R.',
    product: 'Shield Daily',
  },
]

export const team = [
  {
    name: 'Dr. Marcus Adeyemi, MD',
    role: 'Chief Scientific Officer',
    bio: 'Cardiologist and researcher focused on preventive care and population health strategies.',
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
  },
  {
    name: 'Dr. Aisha Williams, MD',
    role: 'Chief Patient Officer',
    bio: 'Internist with a passion for clear communication and evidence-informed wellness education.',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
  },
  {
    name: 'Dr. Keisha Thompson, MD',
    role: 'Chief of Emergency Preparedness',
    bio: 'Emergency physician specializing in crisis readiness and community health communication.',
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80',
  },
]

import 'dotenv/config'
import mongoose from 'mongoose'
import Product from './models/Product.js'

const samples = [
  {
    name: 'Medical Emergency Kit',
    slug: 'medical-emergency-kit',
    description: 'Preparedness bundle — demo product for API seeding.',
    priceCents: 29999,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    sku: 'KIT-EM-001',
    active: true,
  },
  {
    name: 'Ultimate Cellular Detox',
    slug: 'ultimate-cellular-detox',
    description: 'Daily wellness formula — demo.',
    priceCents: 8999,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    sku: 'SUP-DTX-001',
    active: true,
  },
  {
    name: 'Shield Daily',
    slug: 'shield-daily',
    description: 'Antioxidant support — demo.',
    priceCents: 5499,
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
    sku: 'SUP-SH-001',
    active: true,
  },
  {
    name: 'Dual-Action Digestive Cleanse',
    slug: 'dual-action-digestive-cleanse',
    description: 'Two-phase digestive support — demo.',
    priceCents: 34999,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
    sku: 'SUP-DU-001',
    active: true,
  },
  {
    name: 'Metabolic Support + B-Complex',
    slug: 'metabolic-support-b-complex',
    description: 'Daily metabolic wellness — demo.',
    priceCents: 34999,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    sku: 'SUP-MB-001',
    active: true,
  },
  {
    name: 'Recharge NAD+',
    slug: 'recharge-nad',
    description: 'Cellular energy support — demo.',
    priceCents: 7999,
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&q=80',
    sku: 'SUP-NAD-001',
    active: true,
  },
]

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('Set MONGODB_URI in .env')
    process.exit(1)
  }
  await mongoose.connect(process.env.MONGODB_URI)
  let created = 0
  for (const p of samples) {
    const exists = await Product.findOne({ slug: p.slug })
    if (!exists) {
      await Product.create(p)
      created += 1
    }
  }
  console.log(`Seed complete. Created ${created} products (skipped existing slugs).`)
  await mongoose.disconnect()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

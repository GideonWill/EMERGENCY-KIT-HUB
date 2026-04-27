import 'dotenv/config';
import Product from './models/Product.js';

const products = [
  { name: 'Amovulin', file: '/Amovulin.jpg', price: 45 },
  { name: 'Entramol', file: '/Entramol.png', price: 25 },
  { name: 'Neuro-Min Plus', file: '/NEURO-MIN-PLUS.png', price: 85 },
  { name: 'TobCee', file: '/TobCee.png', price: 30 },
  { name: 'TobVital', file: '/TobVital.jpg', price: 40 },
  { name: 'Xferon', file: '/XFERON.png', price: 55 },
  { name: 'Xzole F', file: '/Xzole F.jpg', price: 35 },
  { name: 'Zinvite', file: '/Zinvite.png', price: 60 },
  { name: 'Foligrow', file: '/foligrow.png', price: 45 },
  { name: 'Kofof', file: '/kofof.png', price: 20 },
  { name: 'Lufart DS', file: '/lufart ds.png', price: 50 }
];

async function run() {
  console.log('Seeding products...');
  
  for (const p of products) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Check if exists
    const existing = await Product.findBySlug(slug);
    if (existing) {
      console.log(`Product ${p.name} already exists, skipping.`);
      continue;
    }

    await Product.create({
      name: p.name,
      slug,
      description: `${p.name} - Premium quality medicine from Tobinco Pharmaceuticals. Reliable health support.`,
      priceCents: p.price * 100,
      image: p.file,
      sku: `DRUG-${slug.toUpperCase()}`,
      active: true,
      status: 'In Stock'
    });
    console.log(`Created: ${p.name}`);
  }

  console.log('Seeding complete!');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

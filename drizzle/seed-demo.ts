import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  authUsers,
  shopProducts,
  shopVariants,
  artisanVendors,
  artisanProducts,
  campaigns,
} from './schema';

async function seedDemo() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql);

  // ── Shop Products (Rancheti Merch) ──────────────────────────────
  const shopItems = [
    {
      printfulSyncProductId: 90001,
      name: 'Rancheti Guardian Tee',
      nameEs: 'Camiseta Guardián Rancheti',
      description: 'Soft-washed cotton tee featuring the Rancheti yeti mascot. Unisex fit.',
      descriptionEs: 'Camiseta de algodón suave con la mascota Rancheti. Corte unisex.',
      category: 'apparel',
      isActive: true,
      sortOrder: 1,
    },
    {
      printfulSyncProductId: 90002,
      name: 'I Survived the Ranchita Yeti Hoodie',
      nameEs: 'Sudadera Sobreviví al Yeti de Ranchita',
      description: 'Heavyweight pullover hoodie with front print. Perfect for cool desert nights.',
      descriptionEs: 'Sudadera gruesa con estampado frontal. Perfecta para noches frescas del desierto.',
      category: 'apparel',
      isActive: true,
      sortOrder: 2,
    },
    {
      printfulSyncProductId: 90003,
      name: 'MVVCSO Community Mug',
      nameEs: 'Taza Comunitaria MVVCSO',
      description: '15 oz ceramic mug with the MVVCSO crest. Dishwasher and microwave safe.',
      descriptionEs: 'Taza de cerámica de 15 oz con el escudo de MVVCSO.',
      category: 'accessories',
      isActive: true,
      sortOrder: 3,
    },
    {
      printfulSyncProductId: 90004,
      name: 'Rancheti Die-Cut Sticker Pack',
      nameEs: 'Paquete de Calcomanías Rancheti',
      description: '6 weatherproof vinyl stickers — desert creatures, Rancheti, PCT blazes.',
      descriptionEs: '6 calcomanías de vinilo resistentes — criaturas del desierto, Rancheti, senderos PCT.',
      category: 'accessories',
      isActive: true,
      sortOrder: 4,
    },
    {
      printfulSyncProductId: 90005,
      name: 'Backcountry Strong Trucker Hat',
      nameEs: 'Gorra Trucker Backcountry Fuerte',
      description: 'Structured trucker cap with embroidered "Backcountry Strong" patch.',
      descriptionEs: 'Gorra trucker estructurada con parche bordado "Backcountry Strong".',
      category: 'apparel',
      isActive: true,
      sortOrder: 5,
    },
    {
      printfulSyncProductId: 90006,
      name: 'Ranchita Desert Tote Bag',
      nameEs: 'Bolsa de Mano Desierto de Ranchita',
      description: 'Heavyweight canvas tote with desert landscape print. Great for farmers market runs.',
      descriptionEs: 'Bolsa de lona gruesa con estampado de paisaje desértico.',
      category: 'accessories',
      isActive: true,
      sortOrder: 6,
    },
  ];

  const insertedProducts = [];
  for (const item of shopItems) {
    const [row] = await db
      .insert(shopProducts)
      .values(item)
      .onConflictDoNothing()
      .returning({ id: shopProducts.id, sortOrder: shopProducts.sortOrder });
    if (row) insertedProducts.push(row);
  }
  console.log(`Seeded ${insertedProducts.length} shop products`);

  // ── Shop Variants (prices in cents) ─────────────────────────────
  const variantData: { sortOrder: number; variants: { name: string; printfulVariantId: number; retailPrice: number; printfulPrice: number }[] }[] = [
    {
      sortOrder: 1,
      variants: [
        { name: 'S', printfulVariantId: 80001, retailPrice: 2999, printfulPrice: 1499 },
        { name: 'M', printfulVariantId: 80002, retailPrice: 2999, printfulPrice: 1499 },
        { name: 'L', printfulVariantId: 80003, retailPrice: 2999, printfulPrice: 1499 },
        { name: 'XL', printfulVariantId: 80004, retailPrice: 2999, printfulPrice: 1499 },
      ],
    },
    {
      sortOrder: 2,
      variants: [
        { name: 'S', printfulVariantId: 80010, retailPrice: 4999, printfulPrice: 2499 },
        { name: 'M', printfulVariantId: 80011, retailPrice: 4999, printfulPrice: 2499 },
        { name: 'L', printfulVariantId: 80012, retailPrice: 4999, printfulPrice: 2499 },
        { name: 'XL', printfulVariantId: 80013, retailPrice: 4999, printfulPrice: 2499 },
        { name: '2XL', printfulVariantId: 80014, retailPrice: 5299, printfulPrice: 2699 },
      ],
    },
    {
      sortOrder: 3,
      variants: [
        { name: '15 oz — White', printfulVariantId: 80020, retailPrice: 1899, printfulPrice: 899 },
        { name: '15 oz — Black', printfulVariantId: 80021, retailPrice: 1899, printfulPrice: 899 },
      ],
    },
    {
      sortOrder: 4,
      variants: [
        { name: '6-Pack', printfulVariantId: 80030, retailPrice: 899, printfulPrice: 349 },
      ],
    },
    {
      sortOrder: 5,
      variants: [
        { name: 'One Size', printfulVariantId: 80040, retailPrice: 2499, printfulPrice: 1199 },
      ],
    },
    {
      sortOrder: 6,
      variants: [
        { name: 'One Size', printfulVariantId: 80050, retailPrice: 1999, printfulPrice: 949 },
      ],
    },
  ];

  let variantCount = 0;
  for (const group of variantData) {
    const product = insertedProducts.find((p) => p.sortOrder === group.sortOrder);
    if (!product) continue;
    for (const v of group.variants) {
      await db
        .insert(shopVariants)
        .values({ ...v, productId: product.id })
        .onConflictDoNothing();
      variantCount++;
    }
  }
  console.log(`Seeded ${variantCount} shop variants`);

  // ── Artisan Vendors (need dummy auth users) ─────────────────────
  const vendorUsers = [
    { email: 'maria.vendor@demo.mvvcso.org', name: 'María Santos', role: 'resident' as const },
    { email: 'jim.vendor@demo.mvvcso.org', name: 'Jim Hawkins', role: 'resident' as const },
  ];

  const vendorUserIds: string[] = [];
  for (const u of vendorUsers) {
    const [row] = await db
      .insert(authUsers)
      .values(u)
      .onConflictDoNothing()
      .returning({ id: authUsers.id });
    if (row) vendorUserIds.push(row.id);
  }

  // If users already existed, fetch their IDs
  if (vendorUserIds.length < vendorUsers.length) {
    const { eq } = await import('drizzle-orm');
    for (const u of vendorUsers) {
      const [existing] = await db
        .select({ id: authUsers.id })
        .from(authUsers)
        .where(eq(authUsers.email, u.email));
      if (existing && !vendorUserIds.includes(existing.id)) {
        vendorUserIds.push(existing.id);
      }
    }
  }

  const vendorData = [
    {
      userId: vendorUserIds[0],
      shopName: 'Desert Sage Pottery',
      shopNameEs: 'Cerámica Salvia del Desierto',
      bio: 'Hand-thrown stoneware inspired by the Anza-Borrego desert. Fired in a wood kiln on my Ranchita homestead.',
      bioEs: 'Cerámica de gres hecha a mano inspirada en el desierto de Anza-Borrego.',
      status: 'approved',
      categories: 'pottery,home',
      location: 'Ranchita',
    },
    {
      userId: vendorUserIds[1],
      shopName: 'Backcountry Woodworks',
      shopNameEs: 'Carpintería del Campo',
      bio: 'Handcrafted cutting boards, serving trays, and home goods from locally salvaged mesquite and manzanita wood.',
      bioEs: 'Tablas de cortar, bandejas y artículos para el hogar hechos a mano con madera local.',
      status: 'approved',
      categories: 'woodwork,home',
      location: 'Ranchita',
    },
  ];

  const vendorIds: string[] = [];
  for (const v of vendorData) {
    const [row] = await db
      .insert(artisanVendors)
      .values(v)
      .onConflictDoNothing()
      .returning({ id: artisanVendors.id });
    if (row) vendorIds.push(row.id);
  }

  // Fetch existing if conflict
  if (vendorIds.length < vendorData.length) {
    const { eq } = await import('drizzle-orm');
    for (let i = 0; i < vendorData.length; i++) {
      const [existing] = await db
        .select({ id: artisanVendors.id })
        .from(artisanVendors)
        .where(eq(artisanVendors.userId, vendorData[i].userId));
      if (existing && !vendorIds.includes(existing.id)) {
        vendorIds.push(existing.id);
      }
    }
  }

  console.log(`Seeded ${vendorIds.length} artisan vendors`);

  // ── Artisan Products (prices in cents) ──────────────────────────
  const artisanItems = [
    {
      vendorId: vendorIds[0],
      title: 'Hand-Thrown Desert Sage Bowl',
      titleEs: 'Tazón de Salvia del Desierto Hecho a Mano',
      description: 'A generous 10-inch serving bowl glazed in sage green with terracotta accents. Each piece is unique, shaped on a kick wheel and fired in a wood kiln.',
      descriptionEs: 'Un generoso tazón de servir de 10 pulgadas esmaltado en verde salvia con acentos de terracota.',
      category: 'pottery',
      price: 6500,
      isFeatured: true,
      fulfillment: 'local_pickup',
      inventory: 4,
    },
    {
      vendorId: vendorIds[0],
      title: 'Ranchita Wildflower Honey',
      titleEs: 'Miel de Flores Silvestres de Ranchita',
      description: 'Raw unfiltered honey from hives on our Ranchita homestead. Wildflower-forward with notes of sage and buckwheat. 12 oz jar.',
      descriptionEs: 'Miel cruda sin filtrar de colmenas en nuestra propiedad en Ranchita. 12 oz.',
      category: 'food',
      price: 1400,
      isFeatured: false,
      fulfillment: 'local_pickup',
      inventory: 12,
    },
    {
      vendorId: vendorIds[1],
      title: 'Mesquite Wood Cutting Board',
      titleEs: 'Tabla de Cortar de Madera de Mezquite',
      description: 'Edge-grain cutting board from locally salvaged mesquite. 14×10 inches, food-safe mineral oil finish. Built to last a lifetime.',
      descriptionEs: 'Tabla de cortar de grano lateral de mezquite local. 14×10 pulgadas.',
      category: 'woodwork',
      price: 8500,
      isFeatured: true,
      fulfillment: 'local_pickup',
      inventory: 3,
    },
    {
      vendorId: vendorIds[1],
      title: 'PCT Trail Marker Earrings',
      titleEs: 'Aretes Marcador de Sendero PCT',
      description: 'Laser-cut manzanita wood earrings shaped like PCT trail markers. Lightweight, hypoallergenic posts. A favorite with thru-hikers.',
      descriptionEs: 'Aretes de madera de manzanita cortados con láser en forma de marcadores de sendero PCT.',
      category: 'jewelry',
      price: 2800,
      isFeatured: false,
      fulfillment: 'shipping',
      inventory: 20,
    },
  ];

  let artisanCount = 0;
  for (const item of artisanItems) {
    await db.insert(artisanProducts).values(item).onConflictDoNothing();
    artisanCount++;
  }
  console.log(`Seeded ${artisanCount} artisan products`);

  // ── Fundraising Campaign ────────────────────────────────────────
  await db
    .insert(campaigns)
    .values({
      name: 'Ranchita Roots — Community Center Renovation',
      nameEs: 'Raíces de Ranchita — Renovación del Centro Comunitario',
      description:
        'Help us renovate the MVVCSO community center to better serve Ranchita. Funds will go toward ADA-compliant restrooms, a commercial kitchen for the food pantry, solar panels, and upgraded meeting space for 100+ residents.',
      descriptionEs:
        'Ayúdanos a renovar el centro comunitario de MVVCSO. Los fondos se destinarán a baños accesibles, una cocina comercial para la despensa de alimentos, paneles solares y un espacio mejorado para reuniones.',
      goalAmount: 5000000, // $50,000
      raisedAmount: 1247500, // $12,475 (demo progress)
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-12-31'),
      isActive: true,
      fund: 'capital',
    })
    .onConflictDoNothing();

  await db
    .insert(campaigns)
    .values({
      name: 'Emergency Preparedness Fund',
      nameEs: 'Fondo de Preparación para Emergencias',
      description:
        'Annual fund for CERT training supplies, emergency communication equipment, water storage, and fire-season readiness kits for vulnerable residents.',
      descriptionEs:
        'Fondo anual para suministros de capacitación CERT, equipos de comunicación de emergencia, almacenamiento de agua y kits de preparación para la temporada de incendios.',
      goalAmount: 1500000, // $15,000
      raisedAmount: 890000, // $8,900
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-06-30'),
      isActive: true,
      fund: 'emergency',
    })
    .onConflictDoNothing();

  console.log('Seeded 2 fundraising campaigns');
  console.log('✓ Demo seed complete');
}

seedDemo().catch(console.error);

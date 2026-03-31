import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db, schema } from '@/lib/db';
import { desc, eq, ilike, and, or } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const type = searchParams.get('type');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '20');

  let query = db
    .select({
      id: schema.marketplaceListings.id,
      title: schema.marketplaceListings.title,
      description: schema.marketplaceListings.description,
      category: schema.marketplaceListings.category,
      type: schema.marketplaceListings.type,
      price: schema.marketplaceListings.price,
      photosJson: schema.marketplaceListings.photosJson,
      condition: schema.marketplaceListings.condition,
      location: schema.marketplaceListings.location,
      status: schema.marketplaceListings.status,
      views: schema.marketplaceListings.views,
      createdAt: schema.marketplaceListings.createdAt,
      sellerName: schema.authUsers.name,
      sellerDisplayName: schema.authUsers.displayName,
      sellerId: schema.marketplaceListings.sellerId,
    })
    .from(schema.marketplaceListings)
    .innerJoin(schema.authUsers, eq(schema.marketplaceListings.sellerId, schema.authUsers.id))
    .where(
      (() => {
        const conditions = [eq(schema.marketplaceListings.status, 'active')];
        if (category) conditions.push(eq(schema.marketplaceListings.category, category));
        if (type) conditions.push(eq(schema.marketplaceListings.type, type));
        if (search) conditions.push(
          or(
            ilike(schema.marketplaceListings.title, `%${search}%`),
            ilike(schema.marketplaceListings.description, `%${search}%`)
          )!
        );
        return conditions.length === 1 ? conditions[0] : and(...conditions);
      })()
    )
    .orderBy(desc(schema.marketplaceListings.createdAt))
    .limit(limit);

  const listings = await query;
  return NextResponse.json(listings);
}

const listingSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  category: z.string().min(1),
  type: z.enum(['for_sale', 'for_trade', 'free', 'wanted']).default('for_sale'),
  price: z.number().int().min(0).optional(),
  condition: z.string().optional(),
  location: z.string().optional(),
  photosJson: z.string().optional(),
});

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const data = listingSchema.parse(body);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const [listing] = await db.insert(schema.marketplaceListings).values({
      sellerId: user.id,
      title: data.title,
      description: data.description,
      category: data.category,
      type: data.type,
      price: data.price ?? null,
      condition: data.condition || null,
      location: data.location || 'Ranchita area',
      photosJson: data.photosJson || null,
      expiresAt,
    }).returning();

    return NextResponse.json(listing);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

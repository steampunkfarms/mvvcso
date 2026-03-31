/**
 * Seed blog posts and the recurring Mobile Pantry event.
 *
 * Usage: npx tsx drizzle/seed-content.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const DATABASE_URL = process.env.DATABASE_URL?.trim();
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

// ── Blog Posts ─────────────────────────────────────────────────

const BLOG_POSTS = [
  {
    slug: 'welcome-to-mvvcso',
    titleEn: 'Welcome to the New MVVCSO Website',
    titleEs: 'Bienvenidos al Nuevo Sitio Web de MVVCSO',
    contentEn: `The Montezuma Valley Volunteer Community Service Organization is proud to launch our new website. For over 50 years, MVVCSO has been the heart of community service in Ranchita, and now we're bringing that same spirit online.

This site is your hub for everything happening in our community — from upcoming events and volunteer opportunities to meeting minutes and board updates. We've built it with accessibility in mind, because serving every member of our community means making sure everyone can participate.

Whether you've been in Ranchita for decades or just moved to the valley, we invite you to explore what MVVCSO has to offer. Check out our Programs page to learn about CERT training, food security efforts, senior support, and more.

Have questions? Visit our Contact page or come to our next board meeting — all are welcome.`,
    contentEs: `La Organización de Servicio Comunitario Voluntario del Valle de Montezuma se enorgullece de lanzar nuestro nuevo sitio web. Durante más de 50 años, MVVCSO ha sido el corazón del servicio comunitario en Ranchita, y ahora llevamos ese mismo espíritu al mundo digital.

Este sitio es su centro para todo lo que sucede en nuestra comunidad. Lo hemos construido pensando en la accesibilidad, porque servir a cada miembro de nuestra comunidad significa asegurarnos de que todos puedan participar.

Lo invitamos a explorar lo que MVVCSO tiene para ofrecer.`,
    excerptEn: 'MVVCSO launches a new website to serve the Ranchita community with event info, volunteer opportunities, meeting minutes, and more.',
    excerptEs: 'MVVCSO lanza un nuevo sitio web para servir a la comunidad de Ranchita.',
    author: 'MVVCSO Board',
    category: 'community',
  },
  {
    slug: 'ranchita-mobile-pantry-feeding-san-diego',
    titleEn: 'Ranchita Mobile Pantry: Fighting Hunger in Our Valley',
    titleEs: 'Despensa Móvil de Ranchita: Combatiendo el Hambre en Nuestro Valle',
    contentEn: `Hunger isn't always easy to spot, but it's very real here in Ranchita. Many of our friends, neighbors, and loved ones quietly struggle with food insecurity — meaning they don't always have enough nutritious food to lead healthy lives. In our rural community, these struggles can be even harder due to distance from resources and fewer local support systems.

Food insecurity impacts every part of life, leading to increased stress, chronic health issues, and reduced community resilience. Breaking this cycle matters deeply — not just for those directly affected, but for the entire Ranchita community.

Through our partnership with Feeding San Diego, the Ranchita Mobile Pantry brings free, nutritious food directly to our community on the 2nd and 4th Tuesday of every month from 12:30 PM to 1:30 PM at 37370 Montezuma Valley Rd.

At MVVCSO, we're committed to ensuring no one in Ranchita has to face hunger alone. We warmly invite you to join us — learn more about how hunger impacts Ranchita, and help us build a stronger, healthier, more connected community.

No registration required. No questions asked. Just neighbors helping neighbors.`,
    contentEs: `El hambre no siempre es fácil de detectar, pero es muy real aquí en Ranchita. Muchos de nuestros amigos, vecinos y seres queridos luchan silenciosamente con la inseguridad alimentaria.

A través de nuestra asociación con Feeding San Diego, la Despensa Móvil de Ranchita trae alimentos nutritivos gratuitos directamente a nuestra comunidad el segundo y cuarto martes de cada mes de 12:30 PM a 1:30 PM en 37370 Montezuma Valley Rd.

No se requiere registro. No se hacen preguntas. Solo vecinos ayudando a vecinos.`,
    excerptEn: 'Free food distribution every 2nd and 4th Tuesday in Ranchita through our partnership with Feeding San Diego.',
    excerptEs: 'Distribución gratuita de alimentos cada segundo y cuarto martes en Ranchita.',
    author: 'MVVCSO',
    category: 'programs',
  },
  {
    slug: 'over-50-years-of-community-service',
    titleEn: 'Over 50 Years of Neighbors Helping Neighbors',
    titleEs: 'Más de 50 Años de Vecinos Ayudando a Vecinos',
    contentEn: `The Montezuma Valley Volunteer Community Service Organization has been a cornerstone of the Ranchita community for over half a century. What started as a small group of neighbors coming together to address local needs has grown into an organization that touches nearly every aspect of life in our valley.

From coordinating CERT emergency response training to running the mobile food pantry, from supporting our senior residents to engaging the next generation of community leaders — MVVCSO's volunteers have logged thousands of hours making Ranchita a better place to live.

Our all-volunteer model means that every dollar donated goes directly to programs and services. Our board members, committee chairs, and program coordinators all serve without compensation, driven by a shared love for this community.

As we look to the future, we're expanding our digital presence to better serve residents who may have difficulty attending in-person events. This website, our newsletter, and upcoming online tools are all part of that effort.

Thank you to every volunteer, past and present, who has made MVVCSO what it is today. Here's to the next 50 years.`,
    contentEs: `La Organización de Servicio Comunitario Voluntario del Valle de Montezuma ha sido una piedra angular de la comunidad de Ranchita durante más de medio siglo.

Nuestro modelo totalmente voluntario significa que cada dólar donado va directamente a programas y servicios. Gracias a cada voluntario, pasado y presente, que ha hecho de MVVCSO lo que es hoy.`,
    excerptEn: 'A look back at MVVCSO\'s 50+ year history of community service in the Montezuma Valley.',
    excerptEs: 'Una mirada a los más de 50 años de historia de servicio comunitario de MVVCSO.',
    author: 'MVVCSO Board',
    category: 'history',
  },
  {
    slug: 'cert-training-emergency-preparedness',
    titleEn: 'CERT Training: Be Prepared for Emergencies in Ranchita',
    titleEs: 'Entrenamiento CERT: Esté Preparado para Emergencias en Ranchita',
    contentEn: `Living in a rural community like Ranchita means understanding that emergency services may take longer to reach us than in urban areas. That's why MVVCSO's Community Emergency Response Team (CERT) training program is one of our most important initiatives.

CERT training teaches community members the basics of disaster response: fire safety, light search and rescue, first aid, and team organization. When a wildfire, earthquake, or other emergency strikes, trained CERT volunteers can take immediate action to protect lives and property while waiting for professional responders.

Our CERT program works in partnership with the San Diego County Office of Emergency Services. Training is free and open to all Ranchita residents aged 18 and older. Sessions are held periodically throughout the year — check our Events page for the next training date.

If you're interested in becoming a CERT volunteer, contact us through the website or come to any board meeting to learn more. In Ranchita, being prepared isn't optional — it's how we take care of each other.`,
    contentEs: `Vivir en una comunidad rural como Ranchita significa entender que los servicios de emergencia pueden tardar más en llegar. Por eso el programa de entrenamiento CERT de MVVCSO es una de nuestras iniciativas más importantes.

El entrenamiento es gratuito y abierto a todos los residentes de Ranchita mayores de 18 años.`,
    excerptEn: 'Learn about CERT volunteer training and how you can help keep Ranchita safe during emergencies.',
    excerptEs: 'Conozca el entrenamiento voluntario CERT y cómo puede ayudar a mantener segura a Ranchita.',
    author: 'MVVCSO',
    category: 'programs',
  },
];

// ── Mobile Pantry Events (next 6 months of 2nd & 4th Tuesdays) ──

function getNthTuesday(year: number, month: number, n: number): Date {
  const d = new Date(year, month, 1);
  let count = 0;
  while (count < n) {
    if (d.getDay() === 2) count++;
    if (count < n) d.setDate(d.getDate() + 1);
  }
  d.setHours(12, 30, 0, 0);
  return d;
}

function getPantryDates(): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const m = now.getMonth() + i;
    const year = now.getFullYear() + Math.floor(m / 12);
    const month = m % 12;
    dates.push(getNthTuesday(year, month, 2)); // 2nd Tuesday
    dates.push(getNthTuesday(year, month, 4)); // 4th Tuesday
  }
  return dates.filter(d => d > now).sort((a, b) => a.getTime() - b.getTime());
}

const PANTRY_DESCRIPTION = `Hunger isn't always easy to spot, but it's very real here in Ranchita. Many of our friends, neighbors, and loved ones quietly struggle with food insecurity — meaning they don't always have enough nutritious food to lead healthy lives. In our rural community, these struggles can be even harder due to distance from resources and fewer local support systems.

Food insecurity impacts every part of life, leading to increased stress, chronic health issues, and reduced community resilience. Breaking this cycle matters deeply — not just for those directly affected, but for the entire Ranchita community.

At MVVCSO, we're committed to ensuring no one in Ranchita has to face hunger alone. Through local partnerships and community-driven efforts, we connect our residents with reliable access to nutritious food and essential resources.

We warmly invite you to join us — learn more about how hunger impacts Ranchita, and help us build a stronger, healthier, more connected community.`;

const PANTRY_DESCRIPTION_ES = `El hambre no siempre es fácil de detectar, pero es muy real aquí en Ranchita. Muchos de nuestros amigos, vecinos y seres queridos luchan silenciosamente con la inseguridad alimentaria.

En MVVCSO, estamos comprometidos a asegurar que nadie en Ranchita tenga que enfrentar el hambre solo. A través de asociaciones locales y esfuerzos impulsados por la comunidad, conectamos a nuestros residentes con acceso confiable a alimentos nutritivos y recursos esenciales.`;

async function seed() {
  console.log('📝 Seeding blog posts...\n');

  const now = new Date();
  for (const post of BLOG_POSTS) {
    await db
      .insert(schema.blogPosts)
      .values({
        slug: post.slug,
        titleEn: post.titleEn,
        titleEs: post.titleEs,
        contentEn: post.contentEn,
        contentEs: post.contentEs,
        excerptEn: post.excerptEn,
        excerptEs: post.excerptEs,
        author: post.author,
        category: post.category,
        published: true,
        publishedAt: now,
      })
      .onConflictDoNothing({ target: schema.blogPosts.slug });
    console.log(`  ✅ ${post.titleEn}`);
  }

  console.log('\n📅 Seeding Mobile Pantry events...\n');

  const pantryDates = getPantryDates();
  for (const date of pantryDates) {
    const endDate = new Date(date);
    endDate.setHours(13, 30, 0, 0);

    const monthStr = date.toLocaleDateString('en-US', { month: 'long' });
    const dayStr = date.getDate();

    await db
      .insert(schema.events)
      .values({
        titleEn: 'Ranchita Mobile Pantry — Feeding San Diego',
        titleEs: 'Despensa Móvil de Ranchita — Feeding San Diego',
        descriptionEn: PANTRY_DESCRIPTION,
        descriptionEs: PANTRY_DESCRIPTION_ES,
        date,
        endDate,
        location: '37370 Montezuma Valley Rd, Ranchita, CA 92066',
        isPublic: true,
        category: 'social',
      })
      .onConflictDoNothing();
    console.log(`  ✅ ${monthStr} ${dayStr} — Mobile Pantry`);
  }

  console.log(`\n✅ Seeded ${BLOG_POSTS.length} blog posts and ${pantryDates.length} pantry events.`);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

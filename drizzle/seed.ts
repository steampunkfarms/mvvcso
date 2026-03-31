import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { blogPosts } from './schema';

async function seed() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql);

  const posts = [
    {
      slug: 'welcome-to-new-mvvcso-website',
      titleEn: 'Welcome to the New MVVCSO Website',
      titleEs: 'Bienvenidos al Nuevo Sitio Web de MVVCSO',
      contentEn:
        'We are thrilled to launch the new MVVCSO website! This site is designed to be a hub for the Ranchita community — a place where you can learn about our programs, stay up to date with community news, and connect with your neighbors.\n\nMVVCSO has served Ranchita since 1973, first as the Montezuma Valley Volunteer Fire Department, and now as a comprehensive community service organization. Our mission remains the same: building unity, promoting resilience, and empowering community voices.\n\nThis website is bilingual in English and Spanish because our community speaks both languages. We want every resident to feel welcome and informed.\n\nExplore our programs, read about our history, and consider donating or volunteering. Together, we build a stronger Ranchita.',
      contentEs:
        'Estamos emocionados de lanzar el nuevo sitio web de MVVCSO. Este sitio está diseñado para ser un centro para la comunidad de Ranchita — un lugar donde puedes conocer nuestros programas, mantenerte al día con las noticias comunitarias y conectarte con tus vecinos.\n\nMVVCSO ha servido a Ranchita desde 1973, primero como el Departamento de Bomberos Voluntarios del Valle de Montezuma, y ahora como una organización integral de servicio comunitario.\n\nExplora nuestros programas, lee sobre nuestra historia y considera donar o ser voluntario. Juntos, construimos un Ranchita más fuerte.',
      excerptEn: 'Introducing the new MVVCSO website — a bilingual hub for the Ranchita community.',
      excerptEs: 'Presentando el nuevo sitio web de MVVCSO — un centro bilingüe para la comunidad de Ranchita.',
      author: 'MVVCSO Board',
      category: 'community',
      published: true,
      publishedAt: new Date('2025-03-30'),
    },
    {
      slug: 'history-volunteer-firefighters-to-community-champions',
      titleEn: 'A History of Service: From Volunteer Firefighters to Community Champions',
      titleEs: 'Una Historia de Servicio: De Bomberos Voluntarios a Campeones Comunitarios',
      contentEn:
        'In 1973, the residents of Ranchita came together to form the Montezuma Valley Volunteer Fire Department. In a remote backcountry community with no nearby fire services, neighbors had to protect each other.\n\nOver the decades, MVVFD grew into a cornerstone of Ranchita life. The organization hosted community BBQ fundraisers, responded to devastating wildfires including the 2002 Pines Fire and 2003 Cedar Fire, and secured a $41,500 FEMA grant in 2004.\n\nIn 2008, when the fire department integrated into the San Diego Regional Fire Authority and Station 58 transitioned to CAL FIRE management, the volunteer organization could have dissolved. Instead, it evolved.\n\nIn 2020, MVVFD rebranded as MVVCSO — the Montezuma Valley Volunteer Community Service Organization — expanding its mission to include CERT training, food security, youth programs, senior support, and emergency preparedness.\n\nToday, a new 7-member board leads MVVCSO into its next chapter, honoring the legacy of service that began over 50 years ago.',
      contentEs:
        'En 1973, los residentes de Ranchita se unieron para formar el Departamento de Bomberos Voluntarios del Valle de Montezuma. En una comunidad rural remota sin servicios de bomberos cercanos, los vecinos tenían que protegerse mutuamente.\n\nA lo largo de las décadas, MVVFD creció hasta convertirse en una piedra angular de la vida en Ranchita. En 2020, MVVFD se rebautizó como MVVCSO, ampliando su misión para incluir capacitación CERT, seguridad alimentaria, programas juveniles y más.\n\nHoy, una nueva junta directiva de 7 miembros dirige MVVCSO hacia su próximo capítulo.',
      excerptEn: 'From 1973 to today — how Ranchita\'s volunteer firefighters evolved into a comprehensive community service organization.',
      excerptEs: 'Desde 1973 hasta hoy — cómo los bomberos voluntarios de Ranchita evolucionaron.',
      author: 'MVVCSO',
      category: 'history',
      published: true,
      publishedAt: new Date('2025-03-28'),
    },
    {
      slug: 'how-to-prepare-for-fire-season',
      titleEn: 'How to Prepare for Fire Season in the Backcountry',
      titleEs: 'Cómo Prepararse para la Temporada de Incendios en el Campo',
      contentEn:
        'Fire season in San Diego\'s backcountry is a reality we live with every year. Ranchita\'s high desert location means dry brush, strong winds, and limited access roads. Here\'s how to prepare:\n\nCreate Defensible Space: Clear brush and dead vegetation at least 100 feet from your home. This is the single most effective thing you can do.\n\nHave a Go Bag Ready: Pack essentials — documents, medications, water, phone chargers — in a bag you can grab in minutes.\n\nKnow Your Evacuation Routes: Ranchita has limited road access. Know Highway 78 and S22 routes. Have a meeting point with family.\n\nSign Up for Emergency Alerts: Register with AlertSanDiego.org for official evacuation notices.\n\nJoin CERT Training: MVVCSO offers Community Emergency Response Team training. Contact us to learn about the next session.\n\nStay Connected: In a community where cell service is unreliable, know your neighbors. Check on elderly residents. Share information.\n\nRanchita\'s strength has always been its people looking out for each other. Let\'s stay prepared together.',
      contentEs:
        'La temporada de incendios en el campo de San Diego es una realidad con la que vivimos cada año. La ubicación de Ranchita en el desierto alto significa matorrales secos, vientos fuertes y caminos de acceso limitados.\n\nCree Espacio Defendible: Limpie los arbustos y la vegetación muerta al menos 100 pies de su hogar.\n\nTenga un Bolso de Emergencia Listo: Empaque lo esencial — documentos, medicamentos, agua, cargadores de teléfono.\n\nConozca Sus Rutas de Evacuación: Ranchita tiene acceso vial limitado. Conozca las rutas de la Autopista 78 y S22.\n\nRegístrese para Alertas de Emergencia: Inscríbase en AlertSanDiego.org.\n\nÚnase al Entrenamiento CERT: MVVCSO ofrece capacitación del Equipo de Respuesta a Emergencias Comunitarias.',
      excerptEn: 'Essential fire season preparation tips for Ranchita residents — defensible space, go bags, evacuation routes, and CERT training.',
      excerptEs: 'Consejos esenciales de preparación para la temporada de incendios para los residentes de Ranchita.',
      author: 'MVVCSO',
      category: 'resources',
      published: true,
      publishedAt: new Date('2025-03-25'),
    },
  ];

  for (const post of posts) {
    await db.insert(blogPosts).values(post).onConflictDoNothing({ target: blogPosts.slug });
  }

  console.log(`Seeded ${posts.length} blog posts`);
}

seed().catch(console.error);

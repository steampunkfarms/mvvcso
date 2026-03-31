import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'MVVCSO — Montezuma Valley Volunteer Community Service Organization',
    template: '%s | MVVCSO',
  },
  description:
    'Serving Ranchita since 1973. Emergency preparedness, food security, youth programs, senior support, and community service in San Diego\'s backcountry.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://mvvcso.vercel.app'
  ),
  openGraph: {
    type: 'website',
    siteName: 'MVVCSO',
    locale: 'en_US',
    images: [
      {
        url: '/images/ranchita/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MVVCSO — Montezuma Valley Volunteer Community Service Organization',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

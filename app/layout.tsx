import type { Metadata } from 'next';
import './globals.css';
import './collection.css';
import metadataCounts from '../data/metadata.json';
export const metadata: Metadata = {
  metadataBase: new URL('https://butterfly.tanmay-singh.com'),
  title: 'NBA Butterfly Effect — Every trade has an afterlife',
  description: `What did this trade eventually become? Explore ${metadataCounts.stories} iconic NBA trade stories through players, picks and documented connections. An interactive basketball history by Tanmay.`,
  icons: { icon: '/icon.svg' },
  openGraph: {
    title: 'NBA Butterfly Effect',
    description: `Every trade has an afterlife. Follow the players, picks and unexpected connections across ${metadataCounts.stories} iconic NBA stories.`,
    type: 'website',
    url: 'https://butterfly.tanmay-singh.com',
    images: [
      {
        url: '/social.png',
        width: 1200,
        height: 630,
        alt: 'NBA Butterfly Effect. Every trade has an afterlife.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NBA Butterfly Effect',
    description:
      'Every trade has an afterlife. An interactive basketball archive.',
    images: ['/social.png'],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

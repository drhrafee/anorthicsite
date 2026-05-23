import type { Metadata } from 'next';
import { Krona_One, Geist, Sacramento, Bebas_Neue } from 'next/font/google';
import './globals.css';
import { NavBar } from '@/components/NavBar';
import CursorCircle from '@/components/CursorCircle';
import PageLoader from '@/components/PageLoader';

const kronaOne = Krona_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-krona-one',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

const sacramento = Sacramento({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-sacramento',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
});

export const metadata: Metadata = {
  title: 'Anorthic Studio',
  description: 'AI Workflow Automation, Web Development, and Branding',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${kronaOne.variable} ${geist.variable} ${sacramento.variable} ${bebasNeue.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased min-h-screen bg-cream text-cherry selection:bg-crimson selection:text-cream flex justify-center relative overflow-x-hidden">
        <PageLoader />
        <CursorCircle />
        <div
          className="fixed inset-0 z-0 pointer-events-none opacity-[0.04] mix-blend-color-burn"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
        ></div>
        <div className="w-[92vw] lg:w-[96vw] min-h-[92vh] lg:min-h-[96vh] mt-[4vw] lg:mt-[2vw] mb-[4vw] lg:mb-[2vw] relative z-10 flex flex-col">
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}

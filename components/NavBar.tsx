'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function NavBar() {
  const pathname = usePathname();

  const links = [
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Reviews', path: '/reviews' },
  ];

  return (
    <header className="absolute top-0 left-0 w-full flex items-center justify-between z-50 pointer-events-none">
      <Link href="/" className="pointer-events-auto">
        <Image src="/logo.svg" alt="Anorthic Studio Logo" width={61} height={61} className="w-[45.6px] h-[45.6px] md:w-[60.8px] md:h-[60.8px]" />
      </Link>
      <nav className="flex items-center gap-2.5 md:gap-4 font-sans text-cherry pointer-events-auto">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className={`hover:text-crimson transition-colors font-medium text-[2.4vw] md:text-[1.4vw] lg:text-[0.88vw] uppercase tracking-[0.1em] md:tracking-[0.15em] ${
              pathname === link.path ? 'text-crimson' : ''
            }`}
          >
            {link.name}
          </Link>
        ))}
        <Link 
          href="/contact"
          className="bg-cherry text-cream hover:bg-crimson transition-colors px-[2vw] py-[0.5vw] md:px-[1.2vw] md:py-[0.3vw] rounded-full font-medium text-[2.4vw] md:text-[1.4vw] lg:text-[0.88vw] uppercase tracking-[0.1em] md:tracking-[0.15em]"
        >
          Let&apos;s talk
        </Link>
      </nav>
    </header>
  );
}

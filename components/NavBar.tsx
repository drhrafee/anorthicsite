'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'About', path: '/#about-section' },
    { name: 'Services', path: '/#services-section' },
    { name: 'Projects', path: '/#projects-section' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const id = path.substring(2); // remove '/#'
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL hash without causing a page jump
        window.history.pushState(null, '', path);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full flex items-center justify-between z-50 pointer-events-none transition-all duration-300 px-[4vw] lg:px-[2vw] ${
        scrolled
          ? 'py-3 md:py-4 bg-cream/80 backdrop-blur-md shadow-[0_1px_10px_rgba(40,24,25,0.03)] border-b border-cherry/5'
          : 'pt-[4vw] lg:pt-[2vw] pb-4 bg-transparent'
      }`}
    >
      <Link href="/" className="pointer-events-auto" aria-label="Anorthic Studio Home">
        <Image 
          src="/logo.svg" 
          alt="Anorthic Studio Logo" 
          width={61} 
          height={61} 
          className="w-[45.6px] h-[45.6px] md:w-[60.8px] md:h-[60.8px]" 
          priority 
        />
      </Link>
      <nav className="flex items-center gap-4 md:gap-6 lg:gap-8 font-sans text-cherry pointer-events-auto" aria-label="Main Navigation">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            onClick={(e) => handleLinkClick(e, link.path)}
            aria-current={pathname === link.path ? 'page' : undefined}
            className={`hover:text-crimson transition-colors font-medium text-[2.4vw] md:text-[1.4vw] lg:text-[0.88vw] uppercase tracking-[0.1em] md:tracking-[0.15em] ${
              pathname === link.path ? 'text-crimson' : ''
            }`}
          >
            {link.name}
          </Link>
        ))}
        <Link 
          href="/contact"
          aria-current={pathname === '/contact' ? 'page' : undefined}
          className="bg-cherry text-cream hover:bg-crimson transition-colors px-[2vw] py-[0.5vw] md:px-[1.2vw] md:py-[0.3vw] rounded-full font-medium text-[2.4vw] md:text-[1.4vw] lg:text-[0.88vw] uppercase tracking-[0.1em] md:tracking-[0.15em]"
        >
          Let&apos;s talk
        </Link>
      </nav>
    </header>
  );
}

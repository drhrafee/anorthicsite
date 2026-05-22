import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Anorthic Studio',
  description: 'Learn about Anorthic Studio, our design principles, technical expertise, and how we build uncompromising digital products.',
};

export default function AboutPage() {
  return (
    <div className="flex-1 relative flex flex-col justify-end">
      <div className="w-full">
        <h1 
          className="font-krona text-[11vw] md:text-[9vw] leading-[0.85] tracking-tighter text-cherry font-black uppercase"
          style={{ textShadow: '2px 2px 0px rgba(203, 39, 44, 0.1)' }}
        >
          About
        </h1>
      </div>
    </div>
  );
}

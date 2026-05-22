import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Anorthic Studio',
  description: 'Explore the portfolio of Anorthic Studio, featuring custom web applications, automation architectures, and bespoke brand design case studies.',
};

export default function ProjectsPage() {
  return (
    <div className="flex-1 relative flex flex-col justify-end">
      <div className="w-full">
        <h1 
          className="font-krona text-[11vw] md:text-[9vw] leading-[0.85] tracking-tighter text-cherry font-black uppercase"
          style={{ textShadow: '2px 2px 0px rgba(203, 39, 44, 0.1)' }}
        >
          Projects
        </h1>
      </div>
    </div>
  );
}

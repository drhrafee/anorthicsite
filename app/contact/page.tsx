import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact | Anorthic Studio',
  description: 'Connect with Anorthic Studio to automate your workflows, design your brand architecture, or compile custom high-performance web applications.',
};

export default function ContactPage() {
  return (
    <div className="flex-1 relative flex flex-col justify-between py-[4vw] lg:py-[2vw] gap-12">
      <div className="w-full">
        <h1 
          className="font-krona text-[11vw] md:text-[9vw] leading-[0.85] tracking-tighter text-cherry font-black uppercase"
          style={{ textShadow: '2px 2px 0px rgba(203, 39, 44, 0.1)' }}
        >
          Contact
        </h1>
        <p className="font-geist text-base md:text-lg lg:text-xl text-cherry/80 mt-6 max-w-xl leading-relaxed">
          Let’s build something uncompromising. Reach out via the form below or drop us a line directly at{' '}
          <a href="mailto:hello@anorthic.studio" className="text-crimson hover:underline font-bold">
            hello@anorthic.studio
          </a>.
        </p>
      </div>

      <ContactForm />
    </div>
  );
}

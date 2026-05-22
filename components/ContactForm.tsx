'use client';

import React from 'react';

export default function ContactForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form submission logic can go here
  };

  return (
    <div className="w-full max-w-2xl bg-cherry text-cream rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 lg:p-10 shadow-xl flex flex-col gap-6">
      <form className="flex flex-col gap-6 font-geist" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-xs uppercase tracking-wider font-bold text-cream/70">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Your Name"
              className="bg-cream/10 border border-cream/20 text-cream placeholder-cream/40 rounded-xl px-4 py-3 outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs uppercase tracking-wider font-bold text-cream/70">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="hello@example.com"
              className="bg-cream/10 border border-cream/20 text-cream placeholder-cream/40 rounded-xl px-4 py-3 outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="subject" className="text-xs uppercase tracking-wider font-bold text-cream/70">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            placeholder="Project details / Automation needs / Design"
            className="bg-cream/10 border border-cream/20 text-cream placeholder-cream/40 rounded-xl px-4 py-3 outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-xs uppercase tracking-wider font-bold text-cream/70">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Tell us about what you want to build..."
            className="bg-cream/10 border border-cream/20 text-cream placeholder-cream/40 rounded-xl px-4 py-3 outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          className="bg-crimson text-cream hover:bg-cream hover:text-cherry transition-colors font-medium text-xs md:text-sm uppercase tracking-widest py-4 px-8 rounded-full self-start mt-2 shadow-md"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

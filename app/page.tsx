import AnimatedCounter from '@/components/AnimatedCounter';

export default function Page() {
  return (
    <div className="flex-1 flex flex-col">
      <section className="w-screen h-screen -mx-[4vw] -mt-[4vw] lg:-mx-[2vw] lg:-mt-[2vw] px-[4vw] pb-[4vw] lg:px-[2vw] lg:pb-[2vw] relative flex flex-col justify-end shrink-0">
        <div className="w-full">
          <h1
            className="font-krona text-[13vw] md:text-[11vw] leading-[0.85] tracking-tighter text-cherry font-black uppercase"
            style={{ textShadow: '2px 2px 0px rgba(203, 39, 44, 0.1)' }}
          >
            Anorthic<br />
            <span className="inline-flex items-baseline">
              Studio
              <span className="relative inline-flex w-[2.5vw] h-[2.5vw] md:w-[2vw] md:h-[2vw] ml-2 md:ml-4 self-center md:self-end md:mb-[0.5vw]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75" style={{ animationDuration: '2s' }}></span>
                <span className="relative inline-flex rounded-full h-full w-full bg-crimson"></span>
              </span>
            </span>
          </h1>
        </div>
      </section>

      <section className="flex flex-col shrink-0 w-full">
        <div className="w-full bg-cherry text-cream rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 lg:p-10 flex flex-col justify-start items-start shadow-xl mt-[4vw] lg:mt-[2vw]">
          <p className="m-0 font-geist text-[7vw] md:text-[5vw] lg:text-[4vw] leading-[1.1] md:leading-[1.1] text-cream font-medium w-full">
            We are an atelier of digital architects building uncompromising brand identities, custom web applications, and ai automated workflows.
          </p>

          <div className="grid grid-cols-3 gap-2 md:gap-6 w-full mt-8 md:mt-12 lg:mt-16">
            <AnimatedCounter target={95} suffix="+" label="Lighthouse Speed Score" />
            <AnimatedCounter target={100} suffix="%" label="Pure Code & Bespoke Design" />
            <AnimatedCounter target={24} suffix="/7" label="Autonomous AI Automation" />
          </div>
        </div>
      </section>

      <div className="w-screen h-screen -mx-[4vw] lg:-mx-[2vw] mt-[4vw] lg:mt-[2vw] shrink-0" />
    </div>
  );
}

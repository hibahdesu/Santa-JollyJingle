//app/components/Hero.tsx
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative w-full text-white flex flex-col lg:flex-row justify-center items-center px-8 py-12 sm:py-16 lg:py-24 mt-20"> 
            <div className="relative lg:w-1/2 w-full max-w-[400px] sm:max-w-[600px] mt-8 lg:mt-0 overflow-hidden order-1 lg:order-2">
        <Image
          src="/images/hero.jpg" 
          alt="Santa Claus"
          layout="responsive"  
          width={800}          
          height={800}          
          objectFit="cover" 
        />
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center text-center lg:w-1/2 w-full mb-12 lg:mb-0 order-2 lg:order-1">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate__animated animate__fadeIn font-[family-name:var(--font-santa-mono)]">Welcome to Santa&apos;s JollyJingle! 🎅</h1>
        <p className="text-xl sm:text-2xl md:text-3xl mb-8 animate__animated animate__fadeIn animate__delay-1s font-[family-name:var(--font-santa-sans)]">
          Talk to Santa, send your Christmas wishes, and have some festive fun!
        </p>
        <Link href="/register" className="btn-custom px-6 py-3 text-lg sm:text-xl font-[family-name:var(--font-santa-mono)]">
          Start Chatting
        </Link>
      </div>
    </section>
  );
};

export default Hero;

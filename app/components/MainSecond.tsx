//app/components/mainSecond.tsx
import Link from 'next/link';
import Image from 'next/image';

const MainSecond = () => {
  return (
    <section className="p-6 text-center">
      <div className="max-w-3xl mx-auto flex flex-col justify-center items-center">
        <Image
          src="/images/santa.png"
          alt="Santa Claus"
          width={500}
          height={400}
          className="w-full sm:w-1/2 object-cover"
        />

        <p className="font-semibold py-6 text-lg sm:text-3xl font-[family-name:var(--font-santa-sans)]">
        Santa can&apos;t wait to hear your Christmas wishes! 🎅✨
        </p>

        <Link href="/santa-call" className="btn-custom px-6 py-3 text-lg sm:text-xl font-[family-name:var(--font-santa-mono)]">
            Start Talking to Santa 🎅
        </Link>
      </div>
    </section>
  );
};

export default MainSecond;

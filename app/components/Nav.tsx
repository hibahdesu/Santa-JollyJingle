//app/components/Nav.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs'; 
import { useRouter } from 'next/navigation'; 

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser(); 
  const { signOut } = useClerk(); 
  const router = useRouter(); 

  const handleSignOut = async () => {
    await signOut();
    router.push('/'); 
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-4 sm:px-8 py-6 text-white bg-transparent font-[family-name:var(--font-santa-mono)]">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-yellow-300 tracking-wide relative mx-6">
            <span className="text-red-600">Santa&apos;s </span> JollyJingle 🎅
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6 text-xl font-semibold">
          <Link
            href="/"
            className="text-white hover:text-red-600 active:text-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            🎄 Home
          </Link>
          <Link
            href="/register"
            className="text-white hover:text-red-600 active:text-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            ✨ Register
          </Link>
          <Link
            href="/chat"
            className="text-white hover:text-red-600 active:text-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            💬 Chat with Santa
          </Link>
          <Link
            href="/santa-call"
            className="text-white hover:text-red-600 active:text-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            📞 Call Santa
          </Link>

          {/* Login/Logout Button */}
          {!user ? (
            <Link
              href="/auth/sign-in"
              className="text-white hover:text-red-600 active:text-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              🔑 Login
            </Link>
          ) : (
            <button
              onClick={handleSignOut} 
              className="text-white hover:text-red-600 active:text-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              🚪 Logout
            </button>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="lg:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-gradient-to-r from-[#0a1c3f] via-[#063d5e] to-[#003b5c] text-white flex flex-col items-center py-4 space-y-4">
          <Link
            href="/"
            className="text-white hover:text-red-600 active:text-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            🎄 Home
          </Link>
          <Link
            href="/register"
            className="text-white hover:text-red-600 active:text-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            ✨ Register
          </Link>
          <Link
            href="/chat"
            className="text-white hover:text-red-600 active:text-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            🎅 Chat with Santa
          </Link>
          <Link
            href="/santa-call"
            className="text-white hover:text-red-600 active:text-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            🎅 Call Santa
          </Link>

          {/* Mobile Login/Logout Button */}
          {!user ? (
            <Link
              href="/auth/sign-in"
              className="text-white hover:text-red-600 active:text-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              🔑 Login
            </Link>
          ) : (
            <button
              onClick={handleSignOut} 
              className="text-white hover:text-red-600 active:text-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              🚪 Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Nav;

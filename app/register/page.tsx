//app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useChild } from '@/lib/context/ChildContext'; // Import useChild hook to access context

const Register = () => {
  const [name, setName] = useState('');
  const [wishList, setWishList] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const { setChildData } = useChild(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !wishList) {
      setError('Please fill out both fields!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ childName: name, wishList }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong, please try again.');
        setLoading(false);
        return;
      }

      // Set child data in context (and potentially localStorage)
      setChildData(data.childId, name, wishList);

      setSuccessMessage(data.message || 'Registration successful!');
      setTimeout(() => {
        router.push(`/chat?childId=${data.childId}`); // Redirect to chat page
      }, 2000);
    } catch (error) {
      console.log(error);
      setError('Failed to submit the form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-10">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto w-full">
        
        <div className="flex-1 mb-6 md:mb-0">
          <Image
            src="/images/santaRegister.png"
            alt="Santa With gifts"
            width={600}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Form with background image and blue overlay */}
        <div className="relative flex-1 max-w-md mx-auto p-6 rounded-lg w-full bg-cover bg-center"
             style={{ backgroundImage: "url('/images/bg2.jpg')" }}>
          {/* Blue overlay */}
          <div className="absolute inset-0 bg-[#063d5e] opacity-70 rounded-lg"></div>

          <div className="relative">
            <h2 className="text-3xl font-extrabold text-center text-red-600 mb-4 font-[family-name:var(--font-santa-mono)]">Dear Santa Claus</h2>

            <form onSubmit={handleSubmit}>
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

              <div className="mb-4">
                <label htmlFor="name" className="block text-lg font-semibold text-white font-[family-name:var(--font-santa-mono)]">My name is</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 mt-2 border text-white border-red-500 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  placeholder="Enter your frist and last name"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="wishList" className="block text-lg font-semibold text-white font-[family-name:var(--font-santa-mono)]">My Christmas wish list is</label>
                <textarea
                  id="wishList"
                  value={wishList}
                  onChange={(e) => setWishList(e.target.value)}
                  className="w-full p-3 mt-2 border border-red-600 rounded-lg text-white bg-transparent focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  rows={5}
                  placeholder="What do you want for Christmas?"
                />
              </div>

              <div className="flex justify-center font-[family-name:var(--font-santa-mono)]">
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-custom px-6 py-3 text-lg sm:text-xl ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Submitting...' : 'Submit 🎁'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

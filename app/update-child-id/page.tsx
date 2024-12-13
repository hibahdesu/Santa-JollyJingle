'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const UpdateChildId = () => {
  const { user } = useUser();
  const [childId, setChildId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  if (!user) {
    return <div>Loading...</div>; 
  }

  const handleUpdateChildId = async () => {
    setError('');
    setMessage('');

    if (!childId) {
      setError('Please enter a valid Child ID.');
      return;
    }

    try {
      // Call the API route to update the childId
      const res = await fetch('/api/update-child-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          childId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => {
          router.push(`/chat?childId=${childId}`); 
        }, 2000);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.log(error);
      setError('Failed to update Child ID. Please try again.');
    }
  };

  return (
    <div>
      <h1>Update Your Child ID</h1>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      <input
        type="text"
        placeholder="Enter new Child ID"
        value={childId}
        onChange={(e) => setChildId(e.target.value)}
      />
      <button onClick={handleUpdateChildId}>Update Child ID</button>
    </div>
  );
};

export default UpdateChildId;

//app/components/Snowflakes.tsx
'use client';

import { useEffect } from 'react';

const Snowflakes = () => {
  useEffect(() => {
    const generateSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      snowflake.style.left = `${Math.random() * 100}vw`;
      snowflake.style.animationDuration = `${Math.random() * 3 + 5}s`; 
      document.body.appendChild(snowflake);

      // Remove snowflake once the animation is complete
      setTimeout(() => {
        snowflake.remove();
      }, 10000); // Duration of animation
    };

    // Generate snowflakes at regular intervals
    const interval = setInterval(generateSnowflake, 100);

    // Cleanup snowflake generation when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default Snowflakes;

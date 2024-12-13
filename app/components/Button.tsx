// components/Button.tsx

import React from 'react';

interface ButtonProps {
  text: string;                  // The text to display inside the button
  onClick?: () => void;           // Optional click handler
  className?: string;             // Optional additional class for custom styling
  type?: 'button' | 'submit' | 'reset'; // Optional button type (default: 'button')
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn-custom ${className}`} // Add custom styles here or pass additional classes
    >
      {text}
    </button>
  );
};

export default Button;

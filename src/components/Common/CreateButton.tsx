import React from 'react';

interface CreateButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

export function CreateButton({
  onClick,
  label,
  className = '',
}: CreateButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${className}`}
    >
      {label}
    </button>
  );
}


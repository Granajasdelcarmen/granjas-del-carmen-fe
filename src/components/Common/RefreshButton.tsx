import React from 'react';

interface RefreshButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
}

export function RefreshButton({
  onClick,
  isLoading = false,
  className = '',
}: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      title={isLoading ? 'Cargando...' : 'Actualizar'}
      aria-label={isLoading ? 'Cargando' : 'Actualizar'}
    >
      {isLoading ? (
        'Cargando...'
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 transition-transform duration-300 hover:rotate-180"
        >
          <path
            d="M16.023 9.348h4.992V4.356"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.25 12a9.75 9.75 0 0 1 16.5-6.864"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.977 14.652H2.985v4.992"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21.75 12a9.75 9.75 0 0 1-16.5 6.864"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}


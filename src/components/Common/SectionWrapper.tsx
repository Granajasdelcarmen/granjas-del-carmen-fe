import React, { ReactNode } from 'react';

interface SectionWrapperProps {
  title: string;
  description?: string;
  icon?: string;
  count?: number;
  countLabel?: string;
  actions?: ReactNode;
  children: ReactNode;
  error?: Error | null;
  onRetry?: () => void;
  errorTitle?: string;
}

export function SectionWrapper({
  title,
  description,
  icon,
  count,
  countLabel,
  actions,
  children,
  error,
  onRetry,
  errorTitle = 'Error al cargar datos',
}: SectionWrapperProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {icon && <span className="mr-2">{icon}</span>}
              {title}
            </h2>
            {description && (
              <p className="text-sm text-gray-500">
                {description}
                {count !== undefined && countLabel && (
                  <> ({count} {countLabel})</>
                )}
              </p>
            )}
            {count !== undefined && !description && (
              <p className="text-sm text-gray-500">
                {count} {countLabel || 'items'}
              </p>
            )}
          </div>
          {actions && <div className="flex space-x-3">{actions}</div>}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error ? (
          <div className="text-center py-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {errorTitle}
            </h3>
            <p className="text-gray-500 mb-4">
              {error?.message || 'Error desconocido'}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Reintentar
              </button>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}


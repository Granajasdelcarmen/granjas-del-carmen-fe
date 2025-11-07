import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange' | 'stone';
  subtitle?: string;
  featured?: boolean;
}

export function StatsCard({ title, value, icon, color, subtitle, featured = false }: StatsCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-300 text-blue-900';
      case 'green':
        return 'bg-green-300 text-green-900';
      case 'yellow':
        return 'bg-yellow-300 text-yellow-900';
      case 'red':
        return 'bg-red-300 text-red-900';
      case 'purple':
        return 'bg-purple-300 text-purple-900';
      case 'orange':
        return 'bg-orange-300 text-orange-900';
      case 'stone':
        return 'bg-stone-300 text-stone-900';
      default:
        return 'bg-gray-300 text-gray-900';
    }
  };

  return (
    <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-lg shadow-sm border border-stone-200 p-2.5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${getColorClasses(color)} shadow-sm flex-shrink-0`}>
          <span className="text-base">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-medium text-stone-600 mb-0.5 truncate">{title}</p>
          <p className="text-lg font-bold text-stone-800 mb-0.5">{value}</p>
          {subtitle && (
            <p className="text-[10px] text-stone-600 truncate leading-tight">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

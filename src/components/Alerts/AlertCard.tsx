import React from 'react';
import { Alert } from 'src/types/api';
import { translateAlertName, translateAlertDescription } from 'src/utils';

interface AlertCardProps {
  alert: Alert;
  onComplete: (alertId: number) => void;
  onDecline: (alertId: number) => void;
}

export function AlertCard({ alert, onComplete, onDecline }: AlertCardProps) {
  const translatedName = translateAlertName(alert.name);
  const translatedDescription = alert.description ? translateAlertDescription(alert.description) : undefined;
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return '🔴';
      case 'MEDIUM':
        return '🟡';
      case 'LOW':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isUrgent = new Date(alert.max_date) < new Date();

  return (
    <div className={`bg-white rounded-lg border-2 p-4 ${isUrgent ? 'border-red-400 bg-red-50' : 'border-stone-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-semibold text-gray-900">{translatedName}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(alert.priority)}`}>
              {getPriorityIcon(alert.priority)} {alert.priority}
            </span>
            {isUrgent && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                ⚠️ Urgente
              </span>
            )}
          </div>
          {translatedDescription && (
            <p className="text-sm text-gray-600 mb-2">{translatedDescription}</p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span>📅 Inicio: {formatDate(alert.init_date)}</span>
            <span>⏰ Vence: {formatDate(alert.max_date)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onComplete(alert.id)}
          className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <span>✓</span>
          <span>Completar</span>
        </button>
        <button
          onClick={() => onDecline(alert.id)}
          className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <span>✗</span>
          <span>Declinar</span>
        </button>
      </div>
    </div>
  );
}


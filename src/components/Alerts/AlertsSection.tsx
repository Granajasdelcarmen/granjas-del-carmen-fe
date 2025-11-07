import React, { useState } from 'react';
import { useAlerts, useCompleteAlert, useDeclineAlert } from 'src/hooks/useAlerts';
import { Alert } from 'src/types/api';
import { translateAlertName } from 'src/utils';
import { AlertCard } from './AlertCard';
import { CompleteAlertModal } from './CompleteAlertModal';
import { DeclineAlertModal } from './DeclineAlertModal';
import { SlaughterRabbitsModal } from './SlaughterRabbitsModal';

export function AlertsSection() {
  const { data: alerts, isLoading, error } = useAlerts('PENDING');
  const completeMutation = useCompleteAlert();
  const declineMutation = useDeclineAlert();

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [slaughterModalOpen, setSlaughterModalOpen] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);

  const handleCompleteClick = (alertId: number) => {
    const alert = alerts?.find(a => a.id === alertId);
    if (alert) {
      setSelectedAlert(alert);
      // Si es una alerta de sacrificio, mostrar el modal de selección de conejos
      if (alert.name === 'SLAUGHTER_REMINDER' && alert.animal_type === 'RABBIT') {
        setSlaughterModalOpen(true);
      } else {
        setCompleteModalOpen(true);
      }
    }
  };

  const handleDeclineClick = (alertId: number) => {
    const alert = alerts?.find(a => a.id === alertId);
    if (alert) {
      setSelectedAlert(alert);
      setDeclineModalOpen(true);
    }
  };

  const handleCompleteConfirm = async () => {
    if (!selectedAlert) return;
    
    try {
      await completeMutation.mutateAsync({ alertId: selectedAlert.id });
      setCompleteModalOpen(false);
      setSelectedAlert(null);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleSlaughterConfirm = async (selectedRabbitIds: string[]) => {
    if (!selectedAlert) return;
    
    try {
      await completeMutation.mutateAsync({ 
        alertId: selectedAlert.id, 
        slaughteredRabbitIds: selectedRabbitIds 
      });
      setSlaughterModalOpen(false);
      setSelectedAlert(null);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDeclineConfirm = async (reason: string) => {
    if (!selectedAlert) return;
    
    try {
      await declineMutation.mutateAsync({ alertId: selectedAlert.id, reason });
      setDeclineModalOpen(false);
      setSelectedAlert(null);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
        <div className="text-center py-8">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar alertas</h3>
          <p className="text-gray-500">{error instanceof Error ? error.message : 'Error desconocido'}</p>
        </div>
      </div>
    );
  }

  const activeAlerts = Array.isArray(alerts) ? alerts : [];

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="mr-2">🔔</span>
            Alertas Activas
          </h2>
          {activeAlerts.length > 0 && (
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              {activeAlerts.length}
            </span>
          )}
        </div>

        {activeAlerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">✅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay alertas pendientes</h3>
            <p className="text-gray-500">Todo está al día</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onComplete={handleCompleteClick}
                onDecline={handleDeclineClick}
              />
            ))}
          </div>
        )}
      </div>

      <CompleteAlertModal
        isOpen={completeModalOpen}
        onClose={() => {
          setCompleteModalOpen(false);
          setSelectedAlert(null);
        }}
        onConfirm={handleCompleteConfirm}
        alertName={selectedAlert ? translateAlertName(selectedAlert.name) : ''}
        isLoading={completeMutation.isPending}
      />

      <SlaughterRabbitsModal
        isOpen={slaughterModalOpen}
        onClose={() => {
          setSlaughterModalOpen(false);
          setSelectedAlert(null);
        }}
        onConfirm={handleSlaughterConfirm}
        alertId={selectedAlert?.id || 0}
        isLoading={completeMutation.isPending}
      />

      <DeclineAlertModal
        isOpen={declineModalOpen}
        onClose={() => {
          setDeclineModalOpen(false);
          setSelectedAlert(null);
        }}
        onConfirm={handleDeclineConfirm}
        alertName={selectedAlert ? translateAlertName(selectedAlert.name) : ''}
        isLoading={declineMutation.isPending}
      />
    </>
  );
}


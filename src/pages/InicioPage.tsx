import React from 'react';
import { DashboardStats } from 'src/components/Dashboard/DashboardStats';
import { AlertsSection } from 'src/components/Alerts/AlertsSection';

export function InicioPage() {
  return (
    <div className="space-y-8">
      {/* Dashboard Stats */}
      <DashboardStats />
      
      {/* Alerts Section */}
      <AlertsSection />
    </div>
  );
}

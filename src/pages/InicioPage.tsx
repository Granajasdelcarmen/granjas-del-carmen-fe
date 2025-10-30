import React from 'react';
import { DashboardStats } from 'src/components/Dashboard/DashboardStats';
import { UsersSection } from 'src/components/Users/UsersSection';

export function InicioPage() {
  return (
    <div className="space-y-8">
      {/* Dashboard Stats */}
      <DashboardStats />
      
      {/* Users Section */}
      <UsersSection />
    </div>
  );
}

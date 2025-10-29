import React from 'react';
import { Header } from '../Header';
import { DashboardStats } from '../Dashboard/DashboardStats';
import { UsersSection } from '../Users/UsersSection';
import { RabbitsSection } from '../Rabbits/RabbitsSection';
import { InventorySection } from '../Inventory/InventorySection';

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-200">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Dashboard Stats */}
          <DashboardStats />
          
          {/* Secciones principales */}
          <div className="space-y-8">
            {/* Sección de Usuarios */}
            <UsersSection />
            
            {/* Sección de Conejos */}
            <RabbitsSection />
            
            {/* Sección de Inventario */}
            <InventorySection />
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainLayout;

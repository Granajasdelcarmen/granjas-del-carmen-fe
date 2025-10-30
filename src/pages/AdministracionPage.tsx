import React, { useState } from 'react';
import { AdminSidebar } from 'src/components/Admin/AdminSidebar';
import { RabbitsSection } from 'src/components/Rabbits/RabbitsSection';
import { InventorySection } from 'src/components/Inventory/InventorySection';

export function AdministracionPage() {
  const [activeSection, setActiveSection] = useState('animales');

  const renderContent = () => {
    switch (activeSection) {
      case 'animales':
        return <RabbitsSection />;
      case 'inventario':
        return <InventorySection />;
      default:
        return <RabbitsSection />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        {renderContent()}
      </div>
    </div>
  );
}

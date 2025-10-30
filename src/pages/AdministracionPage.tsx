import React, { useState } from 'react';
import { AdminSidebar } from 'src/components/Admin/AdminSidebar';
import { RabbitsSection } from 'src/components/Rabbits/RabbitsSection';
import { InventorySection } from 'src/components/Inventory/InventorySection';
import { CowsSection } from 'src/components/Animals/CowsSection';
import { SheepSection } from 'src/components/Animals/SheepSection';
import { ChickensSection } from 'src/components/Animals/ChickensSection';

export function AdministracionPage() {
  const [activeSection, setActiveSection] = useState('conejos');

  const renderContent = () => {
    switch (activeSection) {
      case 'conejos':
        return <RabbitsSection />;
      case 'vacas':
        return <CowsSection />;
      case 'ovejas':
        return <SheepSection />;
      case 'gallinas':
        return <ChickensSection />;
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

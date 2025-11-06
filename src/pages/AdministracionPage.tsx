import React, { useState } from 'react';
import { AdminSidebar } from 'src/components/Admin/AdminSidebar';
import { RabbitsSection } from 'src/components/Rabbits/RabbitsSection';
import { InventorySection } from 'src/components/Inventory/InventorySection';
import { CowsSection } from 'src/components/Cows/CowsSection';
import { SheepSection } from 'src/components/Sheep/SheepSection';
import { ChickensSection } from 'src/components/Animals/ChickensSection';
import { RoleGate } from 'src/components/auth/RoleGate';

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
    <RoleGate allowedRoles={['admin']}>
      <div className="flex relative">
        {/* Sidebar */}
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        {/* Main Content */}
        <div className="flex-1 w-full md:ml-0 p-3 sm:p-4 md:p-6 min-w-0">
          {renderContent()}
        </div>
      </div>
    </RoleGate>
  );
}

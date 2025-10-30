import React, { useState } from 'react';

export function CowsSection() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Vacas</h2>
            <p className="text-sm text-gray-500">Gestión de vacas (próximamente servicios)</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Añadir vaca
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="text-center py-10 text-gray-500">Módulo en preparación.</div>
      </div>
    </div>
  );
}



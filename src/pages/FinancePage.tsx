import React, { useState } from 'react';
import { ProductSalesSection } from 'src/components/Finance/ProductSalesSection';
import { TotalSalesSection } from 'src/components/Finance/TotalSalesSection';
import { ExpensesSection } from 'src/components/Finance/ExpensesSection';
import { RoleGate } from 'src/components/auth/RoleGate';

export function FinancePage() {
  const [activeTab, setActiveTab] = useState<'total' | 'products' | 'expenses'>('total');

  return (
    <RoleGate allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Módulo Financiero
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gestiona las ventas (productos y animales) y los gastos de la finca
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 px-4 sm:px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('total')}
                className={`
                  py-3 sm:py-4 px-1 border-b-2 font-medium text-sm sm:text-base min-w-[80px] sm:min-w-[120px]
                  ${activeTab === 'total'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Ventas Totales
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`
                  py-3 sm:py-4 px-1 border-b-2 font-medium text-sm sm:text-base min-w-[80px] sm:min-w-[120px]
                  ${activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Ventas de Productos
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`
                  py-3 sm:py-4 px-1 border-b-2 font-medium text-sm sm:text-base min-w-[80px] sm:min-w-[120px]
                  ${activeTab === 'expenses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Gastos
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'total' && <TotalSalesSection />}
            {activeTab === 'products' && <ProductSalesSection />}
            {activeTab === 'expenses' && <ExpensesSection />}
          </div>
        </div>
      </div>
    </RoleGate>
  );
}


import React, { useState } from 'react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sections = [
    { id: 'conejos', label: 'Conejos', icon: '🐰' },
    { id: 'vacas', label: 'Vacas', icon: '🐄' },
    { id: 'ovejas', label: 'Ovejas', icon: '🐑' },
    { id: 'gallinas', label: 'Gallinas', icon: '🐔' },
    { id: 'inventario', label: 'Inventario', icon: '📦' }
  ];

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
    // Close mobile menu after selection
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-white shadow-sm border-r min-h-screen transition-all duration-300
        fixed md:relative z-50
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'w-16 md:w-16' : 'w-56 sm:w-64'}
      `}>
        <div className={`p-3 sm:p-4 ${isCollapsed ? 'p-2' : ''}`}>
          {/* Header */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-4 sm:mb-6`}>
            {!isCollapsed && (
              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">
                <span className="hidden sm:inline">Administración</span>
                <span className="sm:hidden">Admin</span>
              </h2>
            )}
            <div className="flex items-center gap-2">
              {/* Mobile close button */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Cerrar menú"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Desktop collapse button */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] items-center justify-center"
                aria-label={isCollapsed ? 'Expandir' : 'Colapsar'}
                title={isCollapsed ? 'Expandir' : 'Colapsar'}
              >
                {isCollapsed ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <nav className="space-y-1 sm:space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`
                  w-full flex items-center rounded-lg text-left transition-colors
                  ${isCollapsed 
                    ? 'justify-center px-2 py-3' 
                    : 'space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3'
                  }
                  min-h-[44px]
                  ${activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                title={isCollapsed ? section.label : ''}
              >
                <span className={`${isCollapsed ? 'text-2xl' : 'text-xl'} flex-shrink-0`}>{section.icon}</span>
                {!isCollapsed && (
                  <span className="font-medium text-sm sm:text-base truncate">{section.label}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-20 left-4 z-40 p-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Abrir menú"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
}

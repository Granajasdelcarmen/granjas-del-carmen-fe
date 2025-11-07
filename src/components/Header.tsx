import React, { useState } from 'react';
import { useAuthContext } from './auth/AuthProvider';

import { Page } from 'src/hooks/useNavigation';

interface HeaderProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export function Header({ currentPage, onPageChange }: HeaderProps) {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    isLoggingIn,
    isLoggingOut,
  } = useAuthContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const firstName = user?.name?.split(' ')[0] || '';
  
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Granjas del Carmen
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            <button
              onClick={() => onPageChange('inicio')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                currentPage === 'inicio'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Inicio
            </button>
            {user && (user as any).role === 'admin' && (
              <button
                onClick={() => onPageChange('administracion')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                  currentPage === 'administracion'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Administración
              </button>
            )}
            {user && (user as any).role === 'admin' && (
              <>
                <button
                  onClick={() => onPageChange('usuarios')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                    currentPage === 'usuarios'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Usuarios
                </button>
                <button
                  onClick={() => onPageChange('finanzas')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                    currentPage === 'finanzas'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Finanzas
                </button>
              </>
            )}
            <button
              onClick={() => onPageChange('perfil')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                currentPage === 'perfil'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Perfil
            </button>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-xs sm:text-sm text-gray-500">Verificando...</span>
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-2">
                  {user.picture && (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-900">{firstName}</span>
                </div>
                
                <button
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                  className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
                >
                  {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => login()}
                disabled={isLoggingIn}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] text-sm"
              >
                {isLoggingIn ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && user && (
              <div className="flex items-center space-x-2 mr-2">
                {user.picture && (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Menú"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <button
              onClick={() => {
                onPageChange('inicio');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                currentPage === 'inicio'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Inicio
            </button>
            {user && (user as any).role === 'admin' && (
              <button
                onClick={() => {
                  onPageChange('administracion');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                  currentPage === 'administracion'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Administración
              </button>
            )}
            {user && (user as any).role === 'admin' && (
              <>
                <button
                  onClick={() => {
                    onPageChange('usuarios');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                    currentPage === 'usuarios'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Usuarios
                </button>
                <button
                  onClick={() => {
                    onPageChange('finanzas');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                    currentPage === 'finanzas'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Finanzas
                </button>
              </>
            )}
            <button
              onClick={() => {
                onPageChange('perfil');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                currentPage === 'perfil'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Perfil
            </button>
            {isAuthenticated && user ? (
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {user.picture && (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-900">{firstName}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={isLoggingOut}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
                  >
                    {isLoggingOut ? 'Cerrando...' : 'Cerrar'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    login();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isLoggingIn}
                  className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] text-sm font-medium"
                >
                  {isLoggingIn ? 'Iniciando...' : 'Iniciar Sesión'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

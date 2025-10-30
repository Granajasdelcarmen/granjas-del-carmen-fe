import React from 'react';
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

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Granjas del Carmen
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => onPageChange('inicio')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'inicio'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => onPageChange('administracion')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'administracion'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Administración
            </button>
            <button
              onClick={() => onPageChange('perfil')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'perfil'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Perfil
            </button>
          </nav>

          {/* Auth Button */}
          <div className="flex items-center">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-500">Verificando...</span>
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user.picture && (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => login()}
                disabled={isLoggingIn}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

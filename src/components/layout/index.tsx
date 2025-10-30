import React from 'react';
import { Header } from '../Header';
import { useNavigation } from 'src/hooks/useNavigation';
import { InicioPage } from 'src/pages/InicioPage';
import { AdministracionPage } from 'src/pages/AdministracionPage';
import { PerfilPage } from 'src/pages/PerfilPage';
import { useAuth } from 'src/hooks/useAuth';

function MainLayout() {
  const { currentPage, navigateTo } = useNavigation();
  const { user } = useAuth();

  // Debug user in layout
  console.log('MainLayout:user', user);

  const renderPage = () => {
    switch (currentPage) {
      case 'inicio':
        return <InicioPage />;
      case 'administracion':
        return <AdministracionPage />;
      case 'perfil':
        return <PerfilPage />;
      default:
        return <InicioPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onPageChange={navigateTo} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;

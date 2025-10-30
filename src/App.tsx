import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './components/auth/AuthProvider';
import AuthBootstrap from './components/auth/AuthBootstrap';
import AuthGate from './components/auth/AuthGate';
import MainLayout from './components/layout';
import { useAuth } from './hooks/useAuth';

// Create a client
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthBootstrap />
        <AuthGate>
          <MainLayout/>
        </AuthGate>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

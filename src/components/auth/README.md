# 🔐 Sistema de Autenticación - Frontend

## Resumen

Este sistema de autenticación está diseñado para trabajar con un backend que maneja Auth0. El frontend se comunica con el backend para obtener URLs de login/logout y tokens de autenticación.

## 🏗️ Arquitectura

```
Frontend → Backend → Auth0
    ↑         ↓
    └── Token ←──
```

## 📁 Archivos Creados

- `src/services/authService.ts` - Servicio principal de autenticación
- `src/hooks/useAuth.ts` - Hook personalizado para React Query
- `src/components/auth/AuthProvider.tsx` - Context Provider para React
- `src/components/auth/AuthButton.tsx` - Componente de botón de login/logout

## 🚀 Cómo Usar

### 1. En cualquier componente:

```tsx
import { useAuthContext } from '@/components/auth/AuthProvider';

function MiComponente() {
  const { user, isAuthenticated, login, logout } = useAuthContext();
  
  if (!isAuthenticated) {
    return <button onClick={login}>Iniciar Sesión</button>;
  }
  
  return (
    <div>
      <p>Hola {user?.name}!</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

### 2. Hook directo (sin context):

```tsx
import { useAuth } from '@/hooks/useAuth';

function MiComponente() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // ... resto del código
}
```

## 🔄 Flujo de Autenticación con Auth0

1. **Usuario hace clic en "Iniciar Sesión"**
2. **Frontend** llama a `authService.login()`
3. **Backend** devuelve URL de Auth0
4. **Usuario** es redirigido a Auth0
5. **Auth0** redirige de vuelta al backend
6. **Backend** procesa el callback y redirige al frontend
7. **Frontend** llama a `authService.handleAuthCallback()`
8. **Backend** devuelve información del usuario
9. **Frontend** almacena token y datos del usuario

## 🛠️ Configuración del Backend

Tu backend debe tener estos endpoints:

- `GET /auth/login-url` - Devuelve `{ loginUrl: string }`
- `GET /auth/logout-url` - Devuelve `{ logoutUrl: string }`
- `GET /auth/me` - Devuelve información del usuario autenticado

## 🔧 Variables de Entorno

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_BASE_URL=http://localhost:3000
```

## 📝 Notas Importantes

- Los tokens se almacenan en `localStorage`
- El token se envía automáticamente en cada request HTTP
- Si el token expira (401), el usuario es redirigido al login
- El sistema maneja automáticamente el callback de Auth0
- Compatible con Auth0 Universal Login y Social Connections

# ✅ Verificación de Variables de Entorno

## Para verificar que el frontend está usando las URLs correctas:

1. Abre la consola del navegador (F12)
2. En la pestaña "Console", escribe:
   ```javascript
   console.log('API URL:', process.env.REACT_APP_API_URL);
   console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
   ```

O agrega temporalmente esto en `src/config/api.ts` para ver qué está usando:
```typescript
console.log('🔧 Frontend API Config:', {
  API_URL: process.env.REACT_APP_API_URL,
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL
});
```

## El archivo `.env` debe estar en:
`granjas-del-carmen-fe/.env` (en la raíz del proyecto frontend, al mismo nivel que `package.json`)

## Contenido del `.env`:
```env
REACT_APP_API_URL=https://cd337dfe0d41.ngrok-free.app
REACT_APP_API_BASE_URL=https://cd337dfe0d41.ngrok-free.app/api/v1
```

## ⚠️ IMPORTANTE:
- Las variables DEBEN empezar con `REACT_APP_`
- El archivo debe estar en la raíz del proyecto frontend
- **DEBES REINICIAR el servidor de desarrollo** después de crear/modificar el `.env`


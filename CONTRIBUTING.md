# Contribución - Frontend (React + TypeScript)

## Principios
- Simplicidad y consistencia visual.
- DRY: hooks y componentes reutilizables.
- Tipado estricto en TS; evita `any`.

## Flujo de trabajo
1. Rama `feat/...` o `fix/...`.
2. Define objetivo y TODOs.
3. Commits pequeños y claros.
4. PR con checklist y cómo probar.

## Estructura y estilo
- Estado servidor con React Query; claves de caché consistentes.
- `src/services/api.ts` como única capa HTTP (con `withCredentials`).
- Hooks en `src/hooks`, UI en `components`.
- Componentes puros y pequeños; memoización cuando aporte.
- Tailwind para estilos utilitarios y consistencia.

## API y contratos
- `REACT_APP_API_BASE_URL` apunta a `/api/v1`.
- Tipos en `src/types`; mantenerlos alineados con el backend.

## Autenticación
- `AuthBootstrap` maneja `/auth/callback`.
- `AuthGate` protege vistas.

## Checklist de PR
- [ ] Lint/Prettier pasan
- [ ] Tipos actualizados y sin `any` innecesarios
- [ ] Servicios/Endpoints revisados contra el BE
- [ ] Pruebas manuales (pasos y resultados)
- [ ] UI consistente y accesible

## Variables de entorno (dev)
- `REACT_APP_API_BASE_URL=http://localhost:3000/api/v1`
- `REACT_APP_API_URL=http://localhost:3000`

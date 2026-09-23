# CLAUDE.md

## Descripción de la app

Portal inmobiliario full stack orientado al mercado mexicano. Los visitantes pueden descubrir,
buscar y filtrar propiedades en venta o arriendo, ver su detalle completo (galería, ubicación,
características) y solicitar información. Los usuarios registrados guardan propiedades favoritas
y revisan sus consultas; los administradores gestionan el portal (propiedades, imágenes,
características, usuarios y consultas) desde un área privada. Construido como monorepo con
`apps/web` (frontend Next.js) y `apps/api` (backend Next.js solo API REST) sobre PostgreSQL — ver
"Estado actual del proyecto" más abajo para el detalle de la arquitectura y el progreso.

**El SDD original ya convergió: las 40 tareas de las 6 fases de
`specs/portal-inmobiliario/tasks.md` están completas.** Cualquier funcionalidad nueva que se pida
de aquí en adelante se documenta primero en `spec.md`/`plan.md`, se agrega como tarea nueva en
`tasks.md` y luego se implementa siguiendo el mismo flujo de siempre (ver "Flujo de desarrollo").

## Instrucciones del proyecto

Este proyecto utiliza **Spec-Driven Development (SDD)**.

Antes de implementar cualquier funcionalidad, lee:

- `specs/portal-inmobiliario/spec.md`
- `specs/portal-inmobiliario/plan.md`
- `specs/portal-inmobiliario/tasks.md`

La especificación es la fuente de verdad del proyecto.

## Flujo de desarrollo

1. Lee la especificación y el plan técnico.
2. Revisa `tasks.md`.
3. Identifica la primera tarea pendiente.
4. Implementa únicamente esa tarea.
5. Ejecuta las validaciones y pruebas necesarias.
6. Corrige los errores antes de continuar.
7. Marca la tarea como completada en `tasks.md`.
8. No implementes tareas futuras salvo que el usuario lo solicite explícitamente.

## Reglas de arquitectura

- Utiliza Next.js (version más reciente disponible) + React + TypeScript.
- Utiliza PostgreSQL como única base de datos de la aplicación.
- Utiliza API REST mediante Route Handlers de Next.js.
- No utilices Server Actions.
- Los componentes del frontend no deben acceder directamente a la base de datos.
- Mantén separadas las responsabilidades de API, lógica de negocio y persistencia.
- Utiliza Cloudinary para las imágenes de las propiedades.
- Utiliza Google Maps para mostrar la ubicación de las propiedades.
- Utiliza Web3Forms para el formulario de contacto.
- No expongas secretos al navegador.
- Utiliza variables de entorno para credenciales y claves.

## Reglas de implementación

- Analiza el código existente antes de modificarlo.
- Prefiere cambios pequeños e incrementales.
- No agregues funcionalidades fuera de la tarea actual.
- Mantén TypeScript estricto y evita `any` salvo que sea realmente necesario.
- Valida los datos recibidos por el backend.
- Protege los recursos USER y ADMIN también en el backend.
- Utiliza respuestas REST y códigos HTTP consistentes.
- Mantén la aplicación responsive.
- Respeta la arquitectura existente.

## Regla de finalización

Una tarea solo está terminada cuando:

- su implementación está completa;
- el proyecto compila correctamente;
- las pruebas o validaciones correspondientes pasan;
- no quedan errores bloqueantes conocidos;
- la casilla correspondiente de `tasks.md` está marcada como completada.

## Protocolo SDD (ESTRICTO)
1. ANTES de modificar o crear cualquier código fuente, DEBES leer `specs/portal-inmobiliario/spec.md`.
2. No escribas código sin un plan aprobado en `specs/portal-inmobiliario/plan.md`.
3. Sigue tu progreso línea por línea en `specs/portal-inmobiliario/tasks.md`. Marca las tareas como [x] solo después de que las pruebas (tests) hayan pasado con éxito.

## Comandos de Construcción y Pruebas
- Instalar dependencias: `npm install`
- Ejecutar pruebas: `npm test`
- Ejecutar linter: `npm run lint`
- Servidor de desarrollo: `npm run dev`

## Estilo de Código y Arquitectura
- Seguir los principios de Arquitectura Limpia (Clean Architecture).
- Usar nombres de variables explícitos. No usar abreviaturas.
- Cada nueva funcionalidad debe tener su prueba unitaria correspondiente.

## Estado actual del proyecto

### Estructura: monorepo
El proyecto es un **monorepo** (npm workspaces + Turborepo), no una sola app Next.js:

```text
apps/web/               Frontend Next.js — puerto 3000. Sin acceso a Prisma/DB.
apps/api/                Backend Next.js — puerto 3001. Solo Route Handlers + Prisma + servicios + repositorios.
packages/shared-types/  DTOs compartidos entre ambas apps (sin dependencia de Prisma).
```

- `apps/web` consume `apps/api` exclusivamente vía `fetch()` a `API_URL` (nunca Prisma directo).
- `apps/api` expone CORS (`CORS_ALLOWED_ORIGIN`) para las llamadas desde `apps/web`.
- Levantar todo: `npm run dev` desde la raíz (arranca ambas apps en paralelo vía Turborepo).
- Detalle completo de la arquitectura: `specs/portal-inmobiliario/plan.md` §1 y §4.

### Base de datos y herramientas locales
- PostgreSQL corre en Docker (contenedor `postgres`, imagen `pgvector/pgvector:pg16-trixie`), compartido con otros proyectos del equipo — la base de este proyecto es `portal_inmobiliario`, no tocar otras bases del mismo contenedor.
- ORM: **Prisma 7** (pinneado explícitamente — `npm install prisma` resuelve "latest" a un release candidate 8.x, evitarlo) con `@prisma/adapter-pg`.
- pgAdmin corre en Docker con `--restart always`, accesible en `http://localhost:5050`.

### Progreso (Spec-Driven Development)
- **Fase 1 — Fundamentos**: completa (Pasos 1-5).
- **Fase 2 — Portal público**: completa (Pasos 6-16).
- **Fase 3 — Autenticación y usuario**: completa (Pasos 17-21).
- **Fase 4 — Administración**: completa (Pasos 22-30).
- **Fase 5 — Calidad y finalización**: completa (Pasos 31-37) — SEO/metadata dinámica con Open
  Graph, optimización de consultas e imágenes, responsive/accesibilidad (skip links, jerarquía de
  encabezados, `autocomplete`, `aria-live`), revisión de seguridad (incluida re-verificación de
  `isActive`/rol vigente en cada request, no solo del JWT), QA integral y convergencia final SDD.
- **Fase 6 — Mejoras de seguridad y experiencia**: completa (Pasos 38-40) — rate limiting de
  login (5 intentos fallidos → bloqueo de 15 minutos, por cuenta, `User.failedLoginAttempts`/
  `lockedUntil` en PostgreSQL), sistema de mensajes flash (`FlashProvider`) para login/logout y
  administración de usuarios/propiedades/características, y rate limiting general de requests
  (100/min por IP sobre `/api/**`, en memoria, `apps/api/src/proxy.ts`).
- Progreso detallado y checklist: `specs/portal-inmobiliario/tasks.md`.

### Sistema de diseño (frontend)
Paleta definida como tokens CSS/Tailwind v4 en `apps/web/src/app/globals.css` (tema claro único, sin alternar automáticamente a modo oscuro):

- **Header** (`bg-header` / `text-header-text`): gris azulado oscuro-medio (`#1e293b`), con efecto semitransparente + blur al hacer scroll.
- **Cuerpo / tarjetas** (`bg-background` / `bg-card`): fondo general cálido claro, tarjetas en blanco con sombra para resaltar sobre el fondo.
- **Acento** (`bg-accent` / `text-accent`): ámbar/terracota (`#c2410c`), usado en precios, badges de operación y botones principales.
- **Footer** (`bg-footer` / `text-footer-text`): el tono más oscuro (`#0f172a`), distinto del header para dar jerarquía visual.

## Available Skills

| Skill | Path | Description |
|---|---|---|
| `react-rules` | `.claude/skills/react-rules/SKILL.md` | Estándares de desarrollo y reglas de arquitectura para proyectos y componentes de React con TypeScript, Tailwind CSS, Zustand, Zod, React Hook Form y React Query / SWR. |
| `vercel-react-best-practices` | `.claude/skills/vercel-react-best-practices/SKILL.md` | Guía de optimización de rendimiento para React/Next.js mantenida por Vercel Engineering (70 reglas: eliminar waterfalls, tamaño de bundle, rendimiento server-side, data fetching client-side, re-renders, rendering, JS y patrones avanzados). |
| `web-design-guidelines` | `.claude/skills/web-design-guidelines/SKILL.md` | Revisión de código de UI contra las "Web Interface Guidelines" de Vercel (accesibilidad, estados de foco, formularios, animación, tipografía, contenido, imágenes, rendimiento, navegación/estado en URL, touch, dark mode, i18n, hidratación). |

---

## Skill Trigger Rules

### `react-rules`
- **Activación**: Activar esta habilidad cuando el usuario pida:
  - Crear una nueva aplicación React o generar su estructura con TypeScript.
  - Crear, agregar o modificar componentes de React y maquetación con Tailwind CSS.
  - Diseñar e implementar Custom Hooks (`useAuth`, `useFetch`, etc.).
  - Gestionar estado global utilizando Zustand (`create()`).
  - Crear esquemas de validación de datos utilizando Zod (`z.object`, `z.string`, `parse`, `safeParse`).
  - Implementar formularios utilizando React Hook Form con resolver de Zod.
  - Implementar lógica de UI o fetching de APIs utilizando TanStack Query (React Query) o SWR.
  - Refactorizar código React para cumplir con principios de inmutabilidad, pureza y correcto uso de `useEffect`.

### `vercel-react-best-practices`
- **Activación**: Activar esta habilidad cuando el usuario pida (o cuando se esté a punto de):
  - Escribir componentes React nuevos o páginas/rutas de Next.js (`apps/web`, `apps/api`).
  - Implementar data fetching, ya sea server-side (Route Handlers, Server Components) o client-side.
  - Revisar código existente en busca de problemas de rendimiento.
  - Refactorizar código React/Next.js ya escrito.
  - Optimizar tamaño de bundle o tiempos de carga (imports, dynamic imports, waterfalls de `await`).

### `web-design-guidelines`
- **Activación**: Activar esta habilidad cuando el usuario pida:
  - Revisar la UI ("revisa mi UI", "audita el diseño").
  - Verificar accesibilidad de componentes o páginas.
  - Revisar UX o comparar contra mejores prácticas de interfaz web.
  - Antes de dar por terminada una tarea de frontend con UI nueva o modificada, como chequeo de calidad (foco visible, labels, `aria-*`, formularios, tipografía, manejo de contenido largo/vacío, estado en la URL).

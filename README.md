# Portal Inmobiliario

Portal inmobiliario full stack orientado al mercado mexicano. Los visitantes pueden descubrir,
buscar y filtrar propiedades en venta o arriendo, ver su detalle completo (galería, ubicación,
características) y solicitar información. Los usuarios registrados pueden guardar propiedades
favoritas y revisar sus consultas; los administradores gestionan el portal desde un área privada.

Construido con **Next.js + React + TypeScript**, **PostgreSQL en Supabase** (vía Prisma) y
**Spec-Driven Development (SDD)** con Claude Code.

## Stack técnico

- **Monorepo**: npm workspaces + [Turborepo](https://turborepo.com).
- **Frontend** (`apps/web`): Next.js (App Router) + React + TypeScript + Tailwind CSS. Consume el
  backend exclusivamente vía REST — sin Server Actions ni acceso directo a la base de datos.
- **Backend** (`apps/api`): Next.js usado solo como API REST (Route Handlers) + Prisma ORM +
  PostgreSQL (hospedado en Supabase), con capas separadas de servicios y repositorios. Prisma
  conecta directo vía `@prisma/adapter-pg` — no se usa el Data API ni los clientes de Supabase
  (`supabase-js`), así que RLS no aplica: la autorización la hace la propia API REST.
- **Tipos compartidos** (`packages/shared-types`): DTOs usados por ambas apps, sin dependencia de
  Prisma.
- **Integraciones**: Cloudinary (imágenes), Google Maps (ubicación) y Web3Forms (contacto).
- **Seguridad**: hashing de contraseñas con bcrypt, sesión vía JWT en cookie `httpOnly`,
  autorización verificada en cada request contra la base de datos (no solo contra el token),
  bloqueo de cuentas tras 5 intentos fallidos de login y rate limiting general de la API por IP.

## Estado del proyecto

El desarrollo se hizo siguiendo **Spec-Driven Development (SDD)**: la especificación
([`spec.md`](./specs/portal-inmobiliario/spec.md)) y el plan técnico
([`plan.md`](./specs/portal-inmobiliario/plan.md)) son la fuente de verdad, y el avance se
registró tarea por tarea en [`tasks.md`](./specs/portal-inmobiliario/tasks.md).

**El SDD está terminado: las 41 tareas de las 7 fases están completas.**

| Fase | Estado | Pasos |
|---|---|---|
| 1 — Fundamentos | ✅ Completa | 1-5 |
| 2 — Portal público | ✅ Completa | 6-16 |
| 3 — Autenticación y usuario | ✅ Completa | 17-21 |
| 4 — Administración | ✅ Completa | 22-30 |
| 5 — Calidad y finalización | ✅ Completa | 31-37 |
| 6 — Seguridad y experiencia | ✅ Completa | 38-40 |
| 7 — Infraestructura | ✅ Completa | 41 |

### Qué incluye el portal

- **Visitantes**: landing page, catálogo con búsqueda textual, filtros combinables y
  ordenamiento, detalle de propiedad con galería de imágenes, ubicación en Google Maps y
  formulario de contacto (Web3Forms + persistencia en PostgreSQL).
- **Usuarios registrados**: registro/login/logout, cuenta propia con edición de datos,
  propiedades guardadas como favoritas y consulta de las propiedades por las que ya preguntaron.
- **Administradores**: panel privado con dashboard de indicadores, CRUD de propiedades (con
  publicar/despublicar y destacar), administración de imágenes (Cloudinary sincronizado con
  PostgreSQL), administración de características, administración de usuarios (alta, activar o
  desactivar, cambiar rol) y revisión de consultas.
- **Calidad**: metadata dinámica y Open Graph para SEO, consultas e imágenes optimizadas,
  accesibilidad (navegación por teclado, foco visible, jerarquía de encabezados, lectores de
  pantalla) y diseño responsive en desktop, tablet y móvil.
- **Seguridad y experiencia**: bloqueo de cuentas por intentos fallidos de login, rate limiting
  general de la API contra bots, y mensajes flash de confirmación en las acciones principales.
- **Infraestructura**: base de datos en Supabase (esquema y datos migrados desde Postgres local
  con cero pérdida de información), lista para desplegar en un entorno serverless.

Detalle completo de cada tarea, con lo que se verificó al terminarla, en
[`tasks.md`](./specs/portal-inmobiliario/tasks.md).

## Estructura del repositorio

```text
.
├── apps/
│   ├── web/                    # Frontend Next.js — http://localhost:3000
│   └── api/                    # Backend Next.js (solo API REST) — http://localhost:3001
├── packages/
│   └── shared-types/           # DTOs compartidos entre apps/web y apps/api
├── specs/
│   └── portal-inmobiliario/    # Especificación, plan técnico y tareas (SDD)
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── scripts/                    # Scripts de soporte para el entorno de desarrollo
├── CLAUDE.md                   # Instrucciones permanentes para Claude Code
└── turbo.json
```

## Empezar a desarrollar

### 1. Requisitos

- Node.js 20+
- Un proyecto de [Supabase](https://supabase.com/dashboard) (Postgres administrado). Cualquier
  otro Postgres 15+ también funciona (local, Docker, otro proveedor) — solo ajusta las variables
  de entorno del paso 2.

### 2. Variables de entorno

Cada app tiene su propio `.env.example`:

```bash
cp apps/api/.env.example apps/api/.env   # DATABASE_URL, DIRECT_URL, AUTH_SECRET, Cloudinary, CORS
cp apps/web/.env.example apps/web/.env   # API_URL, NEXT_PUBLIC_SITE_URL, Google Maps, Web3Forms
```

En `apps/api/.env`, saca `DATABASE_URL` y `DIRECT_URL` desde tu proyecto de Supabase:
**Project Settings → Database → Connection string**. `DATABASE_URL` es el *Transaction pooler*
(puerto `6543`, con `?pgbouncer=true` al final — la usa la app en runtime) y `DIRECT_URL` es la
*conexión directa* (puerto `5432` — la usa Prisma solo para migraciones).

### 3. Instalar dependencias y preparar la base de datos

```bash
npm install
npm run db:migrate
npm run db:seed
```

### 4. Levantar el proyecto

```bash
npm run dev
```

Esto arranca `apps/web` (http://localhost:3000) y `apps/api` (http://localhost:3001) en paralelo
vía Turborepo.

> **macOS + iCloud Drive**: si el proyecto vive dentro de una carpeta sincronizada por iCloud
> (por ejemplo `~/Desktop` con "Desktop & Documents" activado), iCloud puede corromper la caché
> de desarrollo de Next.js mientras se escribe (`.next`, `.turbo`). `npm run dev` ejecuta
> automáticamente `scripts/exclude-build-dirs-from-icloud.sh` (hook `predev`) para excluir esas
> carpetas de la sincronización — no requiere ninguna acción manual.

### Otros comandos útiles

```bash
npm run build   # build de ambas apps
npm run lint    # lint de ambas apps
npm run db:studio    # explorar la base de datos con Prisma Studio
```

## Desarrollo guiado por especificación (SDD)

El proyecto se construyó siguiendo **Spec-Driven Development**: la especificación es la fuente de
verdad y las tareas se implementaron una por una, en orden.

```text
specs/portal-inmobiliario/
├── spec.md    # QUÉ debe hacer la aplicación
├── plan.md    # CÓMO se construye técnicamente (arquitectura, monorepo, API, etc.)
└── tasks.md   # Lista de tareas incrementales y su estado (checklist)
```

Las 41 tareas de `tasks.md` están marcadas como completadas: el ciclo de SDD original ya
convergió (ver Paso 37 — Convergencia final del SDD), y las fases agregadas después (6 y 7) se
documentaron y registraron con el mismo formato. `spec.md` y `tasks.md` siguen siendo la
referencia para entender qué hace el portal y con qué se validó cada parte.

### Seguir extendiendo el proyecto con Claude Code

Con el SDD original terminado, cualquier funcionalidad nueva se agrega de la misma forma: primero
se documenta en `spec.md`/`plan.md`, después se registra como tarea nueva en `tasks.md`, y luego
se implementa. Así se hizo, por ejemplo, con la Fase 6 (rate limiting y mensajes flash), agregada
a pedido del usuario después de terminar la Fase 5.

```text
Quiero agregar [descripción de la funcionalidad nueva].

Antes de implementarla, documéntala en spec.md y plan.md si
corresponde, y agrégala como una tarea nueva en tasks.md.
Después impleméntala, valida los cambios y marca la tarea
como completada.
```

Las instrucciones permanentes que Claude Code sigue en este repositorio están en
[`CLAUDE.md`](./CLAUDE.md).

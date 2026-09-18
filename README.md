# Portal Inmobiliario

Portal inmobiliario full stack orientado al mercado mexicano. Los visitantes pueden descubrir,
buscar y filtrar propiedades en venta o arriendo, ver su detalle completo (galería, ubicación,
características) y solicitar información. Los usuarios registrados pueden guardar propiedades
favoritas y revisar sus consultas; los administradores gestionan el portal desde un área privada.

Construido con **Next.js + React + TypeScript**, **PostgreSQL** (vía Prisma) y **Spec-Driven
Development (SDD)** con Claude Code.

## Stack técnico

- **Monorepo**: npm workspaces + [Turborepo](https://turborepo.com).
- **Frontend** (`apps/web`): Next.js (App Router) + React + TypeScript + Tailwind CSS. Consume el
  backend exclusivamente vía REST — sin Server Actions ni acceso directo a la base de datos.
- **Backend** (`apps/api`): Next.js usado solo como API REST (Route Handlers) + Prisma ORM +
  PostgreSQL, con capas separadas de servicios y repositorios.
- **Tipos compartidos** (`packages/shared-types`): DTOs usados por ambas apps, sin dependencia de
  Prisma.
- **Integraciones**: Cloudinary (imágenes), Google Maps (ubicación) y Web3Forms (contacto) — se
  incorporan de forma incremental según el plan técnico.

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
├── CLAUDE.md                   # Instrucciones permanentes para Claude Code
└── turbo.json
```

## Empezar a desarrollar

### 1. Requisitos

- Node.js 20+
- PostgreSQL accesible (local, Docker, o un servicio administrado)

### 2. Variables de entorno

Cada app tiene su propio `.env.example`:

```bash
cp apps/api/.env.example apps/api/.env   # DATABASE_URL, Cloudinary, Web3Forms, CORS
cp apps/web/.env.example apps/web/.env   # API_URL, Google Maps
```

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

### Otros comandos útiles

```bash
npm run build   # build de ambas apps
npm run lint    # lint de ambas apps
npm run db:studio    # explorar la base de datos con Prisma Studio
```

## Desarrollo guiado por especificación (SDD)

El proyecto se construye siguiendo **Spec-Driven Development**: la especificación es la fuente de
verdad y las tareas se implementan una por una, en orden.

```text
specs/portal-inmobiliario/
├── spec.md    # QUÉ debe hacer la aplicación
├── plan.md    # CÓMO se construye técnicamente (arquitectura, monorepo, API, etc.)
└── tasks.md   # Lista de tareas incrementales y su estado (checklist)
```

`tasks.md` refleja el progreso real del proyecto en todo momento — es el mejor lugar para ver qué
está implementado y qué falta.

### Continuar el desarrollo con Claude Code

```text
Continúa con la siguiente tarea pendiente de tasks.md.

Consulta spec.md y plan.md cuando sea necesario.
Implementa únicamente esa tarea, valida los cambios y márcala
como completada cuando esté correctamente terminada.

No avances a la siguiente tarea.
```

Las instrucciones permanentes que Claude Code sigue en este repositorio están en
[`CLAUDE.md`](./CLAUDE.md).

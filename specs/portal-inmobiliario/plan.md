# Plan técnico — Portal Inmobiliario

## 1. Arquitectura

El proyecto es un **monorepo** (npm workspaces + Turborepo) con el frontend y el backend completamente separados, cada uno su propia aplicación Next.js:

```text
apps/web  (frontend, Next.js)          apps/api  (backend, Next.js)
      │                                       │
    fetch() ── API_URL ──────────────►  API REST /api/**
   (server-side, entre procesos)              │
                                               ▼
                                        Capa de servicios
                                               │
                                               ▼
                                        Repositorio / ORM
                                               │
                                               ▼
                                          PostgreSQL
```

`apps/web` no importa Prisma ni accede a la base de datos bajo ninguna circunstancia: todo dato pasa por `fetch()` contra `apps/api`, que es la única app con acceso a PostgreSQL. `apps/web` no tiene ni sabe conectarse a PostgreSQL; solo conoce la URL pública de `apps/api` (variable `API_URL`).

`apps/api` no renderiza UI: es una app Next.js compuesta únicamente por Route Handlers (`app/api/**`), sin `page.tsx` propio.

Ambas apps corren en puertos distintos en desarrollo (`web` en `3000`, `api` en `3001`), por lo que las respuestas de `apps/api` incluyen cabeceras CORS (origen configurable vía `CORS_ALLOWED_ORIGIN`) para soportar además llamadas futuras desde el navegador (Client Components).

Tipos compartidos entre ambas apps (DTOs de la API pública, como `PropertyListItem`/`PropertyDetail`) viven en `packages/shared-types`, un paquete del workspace sin lógica de negocio ni dependencia de Prisma — solo tipos TypeScript.

Integraciones externas:

```text
Cloudinary  → imágenes       (apps/api)
Google Maps → ubicación      (apps/web)
Web3Forms   → contacto       (apps/web, envío client-side; persistencia vía apps/api)
```

## 2. Tecnologías obligatorias

- Next.js
- React
- TypeScript
- PostgreSQL
- API REST con Route Handlers de Next.js
- Cloudinary
- Google Maps
- Web3Forms

## 3. Restricciones

- No utilizar Server Actions.
- No acceder a PostgreSQL directamente desde componentes React.
- No almacenar imágenes binarias en PostgreSQL.
- No exigir latitud/longitud en el formulario ADMIN.
- No implementar funcionalidades especulativas fuera de `spec.md`.

## 4. Estructura del monorepo

```text
.
├── apps/
│   ├── web/                   # Frontend Next.js (puerto 3000)
│   │   ├── src/
│   │   │   ├── app/           # Páginas y layouts (App Router)
│   │   │   ├── components/
│   │   │   └── lib/           # Clientes REST, formato, utilidades
│   │   └── public/
│   │
│   └── api/                   # Backend Next.js (puerto 3001, solo Route Handlers)
│       ├── prisma/            # schema.prisma, migrations, seed
│       └── src/
│           ├── app/api/       # Route Handlers
│           ├── services/
│           ├── repositories/
│           └── lib/           # prisma client, http-error, cors
│
├── packages/
│   └── shared-types/          # DTOs compartidos (sin dependencia de Prisma)
│
├── turbo.json
└── package.json                # workspaces: apps/*, packages/*
```

Adaptar cuando las convenciones actuales de Next.js lo justifiquen sin romper la separación de responsabilidades ni la frontera entre `apps/web` y `apps/api`.

## 5. Modelo de datos

Entidades:

- User
- Property
- PropertyImage
- Feature
- Favorite
- Inquiry

Relaciones:

```text
User 1 --- * Favorite * --- 1 Property
User 1 --- * Inquiry  * --- 1 Property

Property 1 --- * PropertyImage
Property * --- * Feature
```

`Inquiry.userId` puede ser nulo para permitir consultas de visitantes.

## 6. Persistencia

PostgreSQL es la única base de datos. El proyecto lo hospeda en **Supabase** (Postgres
administrado) — se migró desde un Postgres local en Docker usado durante el desarrollo inicial.
Prisma conecta directo a Postgres vía `@prisma/adapter-pg`; no se usa el Data API de Supabase ni
`supabase-js`, así que Row Level Security (RLS) no aplica aquí — la autorización sigue siendo
responsabilidad exclusiva de `apps/api` (ver §10).

Al usarse en modo serverless, la conexión se divide en dos:

- `DATABASE_URL` — Transaction Pooler de Supabase (puerto `6543`, `?pgbouncer=true`), usada por
  el driver adapter en runtime (`apps/api/src/lib/prisma.ts`);
- `DIRECT_URL` — conexión directa/de sesión (puerto `5432`), usada únicamente por
  `apps/api/prisma.config.ts` para `prisma migrate`, ya que el Transaction Pooler no soporta los
  comandos DDL que las migraciones necesitan.

Seleccionar un ORM compatible con las versiones actuales de Next.js y PostgreSQL.

Requisitos:

- migraciones;
- claves foráneas;
- restricciones de unicidad;
- índices cuando estén justificados;
- seed para desarrollo.

Restricciones importantes:

- `User.email` único;
- combinación `(userId, propertyId)` única en favoritos.

## 7. API REST

Propiedades públicas:

```text
GET /api/properties
GET /api/properties/{id}
```

Autenticación:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Favoritos:

```text
GET    /api/favorites
POST   /api/favorites/{propertyId}
DELETE /api/favorites/{propertyId}
```

Consultas:

```text
POST /api/inquiries
```

Administración:

```text
GET    /api/admin/properties
POST   /api/admin/properties
GET    /api/admin/properties/{id}
PUT    /api/admin/properties/{id}
DELETE /api/admin/properties/{id}
```

Crear recursos REST adicionales cuando sean necesarios para:

- imágenes;
- características;
- usuarios;
- consultas.

## 8. Responsabilidades

### Route Handlers

- recibir y analizar HTTP;
- validar entrada básica;
- invocar servicios;
- devolver respuestas HTTP.

### Servicios

- lógica de aplicación;
- reglas de negocio;
- coordinación de persistencia e integraciones.

### Repositorios / ORM

- persistencia;
- consultas a PostgreSQL;
- sin lógica de presentación.

### React

- interfaz;
- interacción;
- estado visual;
- consumo de REST;
- sin acceso directo a base de datos.

## 9. Búsqueda y filtros

`GET /api/properties` debe soportar parámetros como:

```text
search
operation
type
minPrice
maxPrice
bedrooms
bathrooms
minUsableArea
commune
city
region
sort
page
pageSize
```

El filtrado, ordenamiento y paginado debe ejecutarse principalmente en PostgreSQL (`skip`/`take` +
`count` sobre el mismo `where`) y no cargando todo el catálogo en el navegador.

`page` (default `1`, mínimo `1`) y `pageSize` (default `9`, entre `1` y `48`) paginan
`GET /api/properties`. La respuesta pasa de un array plano a un sobre paginado:

```json
{
  "items": [ /* PropertyListItem[] */ ],
  "page": 1,
  "pageSize": 9,
  "total": 37,
  "totalPages": 5
}
```

`apps/web` construye los controles de paginación (anterior/siguiente + números de página)
preservando el resto de los filtros activos en la query string. La landing page, que necesita
curar destacadas/venta/arriendo sobre todo el catálogo publicado, pide una `pageSize` mayor
(el máximo permitido) en lugar de paginar.

En `/properties`, cuando se muestra la primera página sin búsqueda ni filtros activos, se hace una
segunda llamada a `GET /api/properties?featured=true` para obtener las destacadas y renderizarlas
en una sección propia sobre el resto del catálogo paginado. `featured` es un filtro nuevo
(`isFeatured: true` en el `where` de Prisma, igual que el resto de los filtros de
`propertyFiltersSchema`): la alternativa de reutilizar la técnica de la landing (pedir el
`pageSize` máximo y filtrar en el cliente) no sirve aquí porque el catálogo ya supera las 48
propiedades del máximo permitido, así que esa segunda llamada podía dejar fuera destacadas que
cayeran más allá de las primeras 48.

## 10. Autenticación y autorización

Utilizar un mecanismo seguro compatible con la API REST.

Requisitos:

- hashing de contraseñas;
- almacenamiento seguro de sesión/token;
- autorización en servidor;
- no almacenar tokens sensibles en `localStorage`;
- usuarios inactivos no pueden autenticarse;
- endpoints ADMIN requieren ADMIN;
- endpoints privados USER requieren autenticación;
- rate limiting de login: `User.failedLoginAttempts`/`User.lockedUntil` en PostgreSQL (sin
  infraestructura adicional tipo Redis); 5 intentos fallidos bloquean la cuenta 15 minutos; un
  login exitoso reinicia el contador (ver `spec.md` §26). Es **por cuenta**, no por IP: no
  interfiere con el login de otras cuentas.
- rate limiting general de requests: contador en memoria (`Map` a nivel de módulo) dentro de
  `apps/api/src/proxy.ts` (convención `proxy` de Next.js 16, reemplaza a `middleware.ts`), 100
  requests/minuto por IP sobre `/api/:path*` (ver `spec.md` §27). Deliberadamente **no**
  persistido en PostgreSQL ni en Redis: es un contador de altísima frecuencia y vida corta, y
  escribirlo a PostgreSQL en cada request le metería justo el tipo de carga de la que se supone
  que protege a la base de datos. Si el proyecto pasa a correr múltiples instancias, migrar a un
  almacén compartido (Upstash Redis u otro) para que el límite aplique de forma consistente entre
  todas.

## 11. Cloudinary

Flujo:

```text
ADMIN
  │
selecciona archivo
  │
  ▼
API REST
  │
  ▼
Cloudinary
  │
 URL + publicId
  │
  ▼
PostgreSQL
```

Validar:

- tipo;
- tamaño;
- autorización.

La eliminación debe mantener sincronizados Cloudinary y PostgreSQL.

## 12. Google Maps

Construir la ubicación utilizando:

- dirección;
- comuna;
- ciudad;
- región;
- país.

No solicitar coordenadas manuales.

Si posteriormente se requiere geocodificación interna, debe ser transparente para ADMIN y no modificar los campos obligatorios del formulario.

## 13. Web3Forms

Web3Forms documenta su API como pensada para uso client-side: el envío server-side requiere
plan pago de Web3Forms + whitelist de IP. Por eso el envío a Web3Forms se hace directamente desde
el navegador (`apps/web`); el access key de Web3Forms está diseñado para exponerse en el cliente
(equivalente a una site key pública), no es un secreto de backend.

La persistencia de la consulta en PostgreSQL sigue pasando exclusivamente por `apps/api`, como el
resto del acceso a datos.

Flujo (orquestado desde el Client Component del formulario, en `apps/web`):

1. validar datos en el cliente;
2. `POST` a `apps/api` (`/api/inquiries`) para persistir la consulta — valida datos de nuevo en el
   backend, identifica la propiedad (404 si no existe o no está publicada), identifica al usuario
   autenticado cuando exista, y devuelve una respuesta REST consistente;
3. si la persistencia fue exitosa, enviar la consulta a Web3Forms directamente desde el navegador
   (best-effort: un fallo aquí no debe mostrarse como error al usuario, ya que la consulta ya
   quedó guardada);
4. si la persistencia falla, mostrar error al usuario — ese es el caso que no debe perderse
   silenciosamente.

## 14. Errores

Utilizar códigos HTTP apropiados:

- 400
- 401
- 403
- 404
- 409
- 500

Formato recomendado:

```json
{
  "message": "Propiedad no encontrada",
  "status": 404
}
```

No exponer stack traces internos.

## 15. Variables de entorno

Cada app del monorepo tiene su propio `.env` / `.env.example` (sin secretos reales), con las variables que le corresponden:

`apps/api/.env`:

- `DATABASE_URL` (conexión PostgreSQL en Supabase, Transaction Pooler — usada en runtime, ver
  §6);
- `DIRECT_URL` (conexión directa a Supabase — usada solo por Prisma Migrate, ver §6);
- `AUTH_SECRET` (secretos de autenticación);
- credenciales Cloudinary (`CLOUDINARY_*`);
- `CORS_ALLOWED_ORIGIN` (origen permitido de `apps/web`).

`apps/web/.env`:

- `API_URL` (URL de `apps/api`, usada server-side por el frontend para consumir la API REST);
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`;
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (público por diseño de Web3Forms, ver §13);
- `NEXT_PUBLIC_SITE_URL` (URL pública del frontend, usada para generar metadata absoluta — Open
  Graph, canonical — ver `spec.md` §25).

## 16. Validación

Como mínimo validar:

- build;
- migraciones;
- endpoints REST;
- autenticación;
- autorización;
- filtros;
- favoritos;
- consultas;
- subida/eliminación Cloudinary;
- CRUD ADMIN;
- comportamiento responsive.

## 17. Definición de terminado

Una tarea está terminada cuando:

- cumple `spec.md`;
- respeta este plan;
- el build pasa;
- las validaciones correspondientes pasan;
- no quedan errores bloqueantes;
- su checkbox se actualiza en `tasks.md`.

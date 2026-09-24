# Tareas — Portal Inmobiliario

> Ejecutar las tareas en orden. No comenzar la siguiente hasta implementar y validar la actual.

## Fase 1 — Fundamentos

- [x] **Paso 1 — Crear proyecto Next.js**
  - Crear proyecto con React y TypeScript.
  - Configurar estructura básica.
  - Crear `.env.example`.
  - Validar servidor de desarrollo y build.

- [x] **Paso 2 — Layout y navegación**
  - Crear header, navegación, footer y layout.
  - Agregar diseño responsive base.
  - Navegación: Inicio, Propiedades, Comprar, Arrendar, Ingresar.

- [x] **Paso 3 — Configurar PostgreSQL**
  - Configurar PostgreSQL.
  - Seleccionar y configurar ORM.
  - Configurar migraciones.
  - Validar conexión.

- [x] **Paso 4 — Crear modelo de dominio**
  - User.
  - Property.
  - PropertyImage.
  - Feature.
  - Favorite.
  - Inquiry.
  - Crear relaciones y constraints.
  - Ejecutar migraciones.

- [x] **Paso 5 — Crear seed**
  - Propiedades realistas de venta y arriendo.
  - Casas, departamentos, terrenos y oficinas.
  - Diferentes comunas, precios y características.

## Fase 2 — Portal público

- [x] **Paso 6 — API REST pública de propiedades**
  - `GET /api/properties`.
  - `GET /api/properties/{id}`.
  - Mostrar públicamente solo propiedades publicadas.
  - Separar API, servicios y persistencia.

- [x] **Paso 7 — Landing page**
  - Hero.
  - Buscador.
  - Propiedades destacadas.
  - Secciones comprar y arrendar.
  - Llamadas a la acción.

- [x] **Paso 8 — PropertyCard y grid responsive**
  - Crear componente reutilizable.
  - Imagen, título, precio, operación, ubicación, dormitorios, baños y superficie.
  - Crear grid responsive.

- [x] **Paso 9 — Catálogo**
  - Crear `/properties`.
  - Consumir API REST.
  - Mostrar propiedades publicadas.

- [x] **Paso 10 — Búsqueda**
  - Búsqueda textual.
  - Título, comuna, ciudad, región y descripción.
  - Reflejar búsqueda en query parameters.

- [x] **Paso 11 — Filtros**
  - Venta/arriendo.
  - Tipo.
  - Rango de precio.
  - Dormitorios.
  - Baños.
  - Superficie mínima.
  - Comuna/ciudad/región.
  - Permitir filtros combinados.

- [x] **Paso 12 — Ordenamiento y estados**
  - Más recientes.
  - Precio ascendente/descendente.
  - Superficie ascendente/descendente.
  - Loading, vacío y error.
  - Skeletons cuando aporten valor.

- [x] **Paso 13 — Detalle de propiedad**
  - Crear `/properties/{id}`.
  - Mostrar información completa.
  - Consumir exclusivamente API REST.

- [x] **Paso 14 — Galería**
  - Imagen principal.
  - Miniaturas.
  - Navegación.
  - Responsive.

- [x] **Paso 15 — Google Maps**
  - Construir ubicación desde dirección, comuna, ciudad y región.
  - Integrar Google Maps.
  - No solicitar latitud/longitud manual.

- [x] **Paso 16 — Contacto con Web3Forms**
  - Formulario de contacto.
  - Incluir ID/título de propiedad.
  - Estados enviando/éxito/error.
  - Validar datos.

## Fase 3 — Autenticación y usuario

- [x] **Paso 17 — Registro y login REST**
  - Registro.
  - Login.
  - Logout.
  - Endpoint de usuario actual.
  - Hashing seguro.

- [x] **Paso 18 — Autorización USER y ADMIN**
  - Crear roles.
  - Proteger APIs.
  - Proteger páginas.
  - Aplicar permisos en backend.

- [x] **Paso 19 — Cuenta de usuario**
  - Crear `/account`.
  - Mostrar información básica.
  - Preparar secciones de propiedades interesadas y consultadas.

- [x] **Paso 20 — Favoritos**
  - Listar.
  - Agregar.
  - Eliminar.
  - Evitar duplicados.
  - Integrar en interfaz.

- [x] **Paso 21 — Persistir consultas**
  - Crear consulta mediante REST.
  - Persistir en PostgreSQL.
  - Asociar propiedad.
  - Asociar usuario cuando exista.
  - Integrar envío Web3Forms.

## Fase 4 — Administración

- [x] **Paso 22 — Dashboard ADMIN**
  - Crear `/admin`.
  - Mostrar indicadores.
  - Restringir a ADMIN.

- [x] **Paso 23 — CRUD REST de propiedades**
  - Listar.
  - Crear.
  - Obtener.
  - Actualizar.
  - Eliminar.
  - Proteger endpoints.

- [x] **Paso 24 — Interfaz de administración**
  - `/admin/properties`.
  - `/admin/properties/new`.
  - `/admin/properties/{id}/edit`.

- [x] **Paso 25 — Formulario de propiedad**
  - Título y descripción.
  - Operación y tipo.
  - Precio.
  - Superficie útil/total.
  - Dormitorios, baños y estacionamientos.
  - Antigüedad.
  - Dirección, comuna, ciudad y región.
  - Características.
  - Publicada/destacada.
  - No agregar latitud/longitud manual.

- [x] **Paso 26 — Subida a Cloudinary**
  - Configurar Cloudinary.
  - Crear subida segura mediante REST.
  - Validar tipo y tamaño.
  - Guardar URL y `publicId`.

- [x] **Paso 27 — Administración de imágenes**
  - Múltiples imágenes.
  - Eliminar.
  - Seleccionar principal.
  - Ordenar.
  - Mantener sincronizados Cloudinary y PostgreSQL.

- [x] **Paso 28 — Características**
  - Múltiples características por propiedad.
  - Modelo flexible.
  - Permitir nuevas características sin modificar columnas de Property.

- [x] **Paso 29 — Usuarios**
  - Crear `/admin/users`.
  - Listar y buscar.
  - Dar de alta nuevas cuentas (USER o ADMIN).
  - Activar/desactivar.
  - Modificar rol cuando corresponda.

- [x] **Paso 30 — Consultas**
  - Crear `/admin/inquiries`.
  - Mostrar propiedad, usuario, contacto, mensaje y fecha.
  - Enlazar propiedad asociada.

## Fase 5 — Calidad y finalización

- [x] **Paso 31 — SEO y metadata**
  - Metadata dinámica.
  - Título.
  - Descripción.
  - Open Graph.

- [x] **Paso 32 — Optimización**
  - Optimizar imágenes Next.js/Cloudinary.
  - Evitar imágenes sobredimensionadas.
  - Revisar solicitudes duplicadas.
  - Revisar consultas PostgreSQL.
  - [x] Búsqueda insensible a acentos/ñ (extensión `unaccent`) en propiedades, usuarios y
    consultas del admin, y en el buscador público.

- [x] **Paso 33 — Responsive y accesibilidad**
  - Desktop.
  - Tablet.
  - Móvil.
  - Labels, teclado, foco, alt y semántica.

- [x] **Paso 34 — Seguridad**
  - Autenticación.
  - Autorización.
  - Validación REST.
  - Uploads.
  - Secretos.
  - Cloudinary.
  - Web3Forms.
  - Endpoints ADMIN.

- [x] **Paso 35 — QA integral**
  - Flujos visitante.
  - Flujos USER.
  - Flujos ADMIN.
  - Errores y códigos HTTP.
  - Corregir defectos bloqueantes.

- [x] **Paso 36 — Cumplimiento arquitectónico**
  - Confirmar que no existen Server Actions.
  - Confirmar comunicación REST.
  - Confirmar PostgreSQL.
  - Confirmar que React no accede a DB.
  - Confirmar permisos backend.
  - Confirmar integraciones externas.

- [x] **Paso 37 — Convergencia final del SDD**
  - Releer `spec.md`.
  - Releer `plan.md`.
  - Comparar implementación con requisitos.
  - Corregir faltantes o inconsistencias.
  - Ejecutar build y validaciones finales.
  - Confirmar ausencia de errores bloqueantes.

## Fase 6 — Mejoras de seguridad y experiencia (solicitadas por el usuario)

- [x] **Paso 38 — Rate limiting de login**
  - Bloquear una cuenta tras 5 intentos fallidos consecutivos (15 minutos).
  - Reiniciar el contador tras un login exitoso.
  - Aplicar la restricción en backend (`apps/api`), incluso con contraseña correcta durante el
    bloqueo.
  - Verificado con pruebas manuales (curl): 401 en los primeros 4 intentos, 429 al 5º y
    posteriores, reset tras login exitoso.

- [x] **Paso 39 — Mensajes flash**
  - `FlashProvider` (Context de React) en el layout raíz de `apps/web`, visible tanto en el sitio
    público como en `/admin`.
  - Se muestran arriba de la página, se cierran manualmente o a los 5 segundos.
  - Integrados en: login, logout, alta/edición/activación de usuarios, alta/edición/eliminación
    de propiedades, creación/renombrado de características.
  - Verificado visualmente en tema claro (sitio público) y oscuro (admin).

- [x] **Paso 40 — Rate limiting general de requests**
  - `apps/api/src/proxy.ts` (convención `proxy` de Next.js 16.0+, reemplaza `middleware.ts`):
    100 requests/minuto por IP sobre `/api/:path*`, contador en memoria por proceso.
  - `OPTIONS` (preflight CORS) excluido del conteo.
  - Respuesta `429` con cabecera `Retry-After` y headers CORS, formato `{ message, status }`
    consistente con `toErrorResponse`.
  - Verificado en build de producción (`next start`): exactamente 100 requests permitidos, el
    101º bloqueado; la ventana se libera pasado 1 minuto.

## Fase 7 — Infraestructura (solicitada por el usuario)

- [x] **Paso 41 — Migrar la base de datos de local a Supabase**
  - `apps/api/prisma.config.ts`: datasource apunta a `DIRECT_URL` (conexión directa, puerto
    `5432`) para que `prisma migrate` pueda ejecutar DDL; el runtime (`lib/prisma.ts`) sigue
    usando `DATABASE_URL` (Transaction Pooler, puerto `6543`, `?pgbouncer=true`) sin cambios.
  - `prisma migrate deploy` aplicó las 4 migraciones existentes contra Supabase, recreando el
    esquema completo (tablas, índices, extensión `unaccent`) sin modificar ni un archivo de
    migración.
  - Datos migrados con `pg_dump --data-only` (tabla por tabla, en orden de dependencia por
    llaves foráneas) desde el Postgres local en Docker, restaurados con `psql` contra
    `DIRECT_URL`. Verificado que los conteos de filas coinciden exactamente entre origen y
    destino en las 7 tablas (`users`, `properties`, `property_images`, `features`, `favorites`,
    `inquiries`, `_FeatureToProperty`).
  - Verificado end-to-end contra Supabase: catálogo público, login (confirma que los hashes de
    contraseña migraron íntegros), búsqueda sin acentos (`unaccent`) y build/lint de ambas apps.
  - RLS no se activó (decisión explícita del usuario): la autorización la sigue haciendo
    `apps/api` en el backend, igual que antes — Prisma conecta directo a Postgres sin pasar por
    el Data API de Supabase. Se usó el rol `postgres` existente en vez de crear un rol `prisma`
    dedicado (también decisión explícita del usuario).

## Fase 8 — Paginación del catálogo público (solicitada por el usuario)

- [x] **Paso 42 — Agregar paginación en `/properties`**
  - `GET /api/properties` acepta `page` (default 1) y `pageSize` (default 9, máx. 48) y devuelve
    un sobre paginado (`items`, `page`, `pageSize`, `total`, `totalPages`) en vez de un array
    plano.
  - El conteo y el recorte de resultados se ejecutan en PostgreSQL (`prisma.property.count` +
    `skip`/`take` sobre el mismo `where` que el listado), no en el navegador.
  - `/properties` muestra controles de paginación (`PropertyPagination.tsx`): primera, anterior,
    números de página (rango de 3 hacia cada lado de la actual, con `…` cuando hay salto hasta la
    primera/última), siguiente y última. Los controles preservan búsqueda, filtros y orden activos
    en la query string (ej. `/properties?sort=price_desc&page=2`); `page=1` se omite de la URL
    para mantenerla limpia, igual que `sort=newest`.
  - La landing page (que cura destacadas/venta/arriendo sobre todo el catálogo publicado) pide el
    `pageSize` máximo (48) en una sola llamada en vez de paginar.
  - `/api/admin/properties` no se tocó: sigue devolviendo un array plano sin paginar (fuera de
    alcance de este pedido).
  - Verificado: build y lint limpios en `apps/api` y `apps/web`; probado manualmente en el
    navegador con las 13 propiedades del seed (9 en página 1, 4 en página 2) — controles
    anterior/primera deshabilitados en la página 1, siguiente/última deshabilitados en la última
    página, y los filtros (`operation`, `sort`) se preservan correctamente al cambiar de página.

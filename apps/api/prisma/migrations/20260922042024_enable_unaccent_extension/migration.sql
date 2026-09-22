-- Habilita la extensión unaccent de PostgreSQL para que las búsquedas de texto
-- ignoren tildes/diacríticos (ej. "montana" también encuentra "montaña").
CREATE EXTENSION IF NOT EXISTS unaccent;

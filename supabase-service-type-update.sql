-- Agregar campo tipo_servicio a cotizaciones y reservas
-- Ejecutar este SQL en Supabase SQL Editor

-- 1. Agregar campo tipo_servicio a cotizaciones
ALTER TABLE cotizaciones
ADD COLUMN IF NOT EXISTS tipo_servicio VARCHAR(50) DEFAULT 'alquiler'
CHECK (tipo_servicio IN ('alquiler', 'decoracion'));

-- 2. Agregar campo tipo_servicio a reservas
ALTER TABLE reservas
ADD COLUMN IF NOT EXISTS tipo_servicio VARCHAR(50) DEFAULT 'alquiler'
CHECK (tipo_servicio IN ('alquiler', 'decoracion'));

-- 3. Comentarios para documentación
COMMENT ON COLUMN cotizaciones.tipo_servicio IS 'Tipo de servicio: alquiler (solo renta) o decoracion (incluye servicio de decoración)';
COMMENT ON COLUMN reservas.tipo_servicio IS 'Tipo de servicio: alquiler (solo renta) o decoracion (incluye servicio de decoración)';

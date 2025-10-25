-- Actualización del esquema para gestión de productos en cotizaciones y reservas
-- Ejecutar este SQL en Supabase SQL Editor

-- 1. Tabla para productos en cotizaciones (items de la cotización)
CREATE TABLE IF NOT EXISTS productos_cotizacion (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cotizacion_id UUID REFERENCES cotizaciones(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT cantidad_positiva CHECK (cantidad > 0)
);

-- 2. Tabla para productos en reservas (items confirmados)
CREATE TABLE IF NOT EXISTS productos_reserva (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reserva_id UUID REFERENCES reservas(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT cantidad_positiva_reserva CHECK (cantidad > 0)
);

-- 3. Agregar campo total a cotizaciones (si no existe)
ALTER TABLE cotizaciones
ADD COLUMN IF NOT EXISTS total DECIMAL(10, 2) DEFAULT 0;

-- 4. Agregar campo total a reservas (si no existe)
ALTER TABLE reservas
ADD COLUMN IF NOT EXISTS total DECIMAL(10, 2) DEFAULT 0;

-- 5. Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_productos_cotizacion_cotizacion
ON productos_cotizacion(cotizacion_id);

CREATE INDEX IF NOT EXISTS idx_productos_cotizacion_producto
ON productos_cotizacion(producto_id);

CREATE INDEX IF NOT EXISTS idx_productos_reserva_reserva
ON productos_reserva(reserva_id);

CREATE INDEX IF NOT EXISTS idx_productos_reserva_producto
ON productos_reserva(producto_id);

CREATE INDEX IF NOT EXISTS idx_reservas_fecha
ON reservas(fecha_evento);

-- 6. Función para calcular stock disponible en una fecha específica
CREATE OR REPLACE FUNCTION get_stock_disponible(
  p_producto_id UUID,
  p_fecha DATE
) RETURNS INTEGER AS $$
DECLARE
  v_stock_total INTEGER;
  v_stock_reservado INTEGER;
BEGIN
  -- Obtener stock total del producto
  SELECT stock INTO v_stock_total
  FROM productos
  WHERE id = p_producto_id;

  -- Calcular stock reservado para esa fecha
  SELECT COALESCE(SUM(pr.cantidad), 0) INTO v_stock_reservado
  FROM productos_reserva pr
  INNER JOIN reservas r ON pr.reserva_id = r.id
  WHERE pr.producto_id = p_producto_id
    AND r.fecha_evento = p_fecha
    AND r.estado IN ('confirmada', 'pendiente');

  -- Retornar stock disponible
  RETURN v_stock_total - v_stock_reservado;
END;
$$ LANGUAGE plpgsql;

-- 7. Row Level Security (RLS) Policies

-- Políticas para productos_cotizacion
ALTER TABLE productos_cotizacion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
ON productos_cotizacion FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON productos_cotizacion FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
ON productos_cotizacion FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Enable delete for authenticated users"
ON productos_cotizacion FOR DELETE
TO authenticated
USING (true);

-- Políticas para productos_reserva
ALTER TABLE productos_reserva ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users on productos_reserva"
ON productos_reserva FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users on productos_reserva"
ON productos_reserva FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users on productos_reserva"
ON productos_reserva FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Enable delete for authenticated users on productos_reserva"
ON productos_reserva FOR DELETE
TO authenticated
USING (true);

-- 8. Comentarios para documentación
COMMENT ON TABLE productos_cotizacion IS 'Productos incluidos en cada cotización';
COMMENT ON TABLE productos_reserva IS 'Productos confirmados en cada reserva';
COMMENT ON FUNCTION get_stock_disponible IS 'Calcula el stock disponible de un producto para una fecha específica';

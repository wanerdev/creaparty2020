-- Corrección de permisos para permitir acceso público a la verificación de stock
-- Ejecutar este SQL en Supabase SQL Editor

-- 1. Permitir lectura pública de productos_reserva (necesario para calcular stock)
DROP POLICY IF EXISTS "Enable read access for authenticated users on productos_reserva" ON productos_reserva;

CREATE POLICY "Enable read access for all users on productos_reserva"
ON productos_reserva FOR SELECT
USING (true);

-- 2. Permitir lectura pública de reservas (necesario para la función)
-- Verificar si ya existe y eliminar
DROP POLICY IF EXISTS "Enable read access for all on reservas" ON reservas;

CREATE POLICY "Enable read access for all on reservas"
ON reservas FOR SELECT
USING (true);

-- 3. Otorgar permisos de ejecución a la función para usuarios anónimos
GRANT EXECUTE ON FUNCTION get_stock_disponible(UUID, DATE) TO anon;
GRANT EXECUTE ON FUNCTION get_stock_disponible(UUID, DATE) TO authenticated;

-- 4. Permitir lectura pública de productos_cotizacion también (por si acaso)
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON productos_cotizacion;

CREATE POLICY "Enable read access for all users on productos_cotizacion"
ON productos_cotizacion FOR SELECT
USING (true);

-- 5. Verificar que la función existe y recrearla si es necesario
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

  -- Si no se encuentra el producto, retornar 0
  IF v_stock_total IS NULL THEN
    RETURN 0;
  END IF;

  -- Calcular stock reservado para esa fecha
  -- Solo considerar reservas confirmadas o pendientes
  SELECT COALESCE(SUM(pr.cantidad), 0) INTO v_stock_reservado
  FROM productos_reserva pr
  INNER JOIN reservas r ON pr.reserva_id = r.id
  WHERE pr.producto_id = p_producto_id
    AND r.fecha_evento = p_fecha
    AND r.estado IN ('confirmada', 'pendiente');

  -- Retornar stock disponible (nunca negativo)
  RETURN GREATEST(v_stock_total - v_stock_reservado, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Comentario explicativo
COMMENT ON FUNCTION get_stock_disponible IS 'Calcula el stock disponible de un producto para una fecha específica. Accesible públicamente para el catálogo.';

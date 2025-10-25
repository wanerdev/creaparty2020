-- Creaparty Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categorías de productos
CREATE TABLE categorias (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Productos/Mobiliario
CREATE TABLE productos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  imagen_url TEXT,
  stock INTEGER DEFAULT 0,
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Cotizaciones
CREATE TABLE cotizaciones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  fecha_evento DATE NOT NULL,
  tipo_evento VARCHAR(100) NOT NULL,
  num_personas INTEGER NOT NULL,
  mensaje TEXT,
  estado VARCHAR(50) DEFAULT 'pendiente', -- pendiente, aprobada, rechazada
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Reservas
CREATE TABLE reservas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cotizacion_id UUID REFERENCES cotizaciones(id) ON DELETE SET NULL,
  nombre_cliente VARCHAR(255) NOT NULL,
  email_cliente VARCHAR(255) NOT NULL,
  telefono_cliente VARCHAR(50) NOT NULL,
  fecha_evento DATE NOT NULL,
  tipo_evento VARCHAR(100) NOT NULL,
  num_personas INTEGER NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente', -- pendiente, confirmada, completada, cancelada
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Productos en reserva (relación muchos a muchos)
CREATE TABLE reserva_productos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reserva_id UUID REFERENCES reservas(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Galería de imágenes
CREATE TABLE galeria (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  titulo VARCHAR(255),
  descripcion TEXT,
  url TEXT NOT NULL,
  categoria VARCHAR(100), -- bodas, cumpleanos, corporativos, otros
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Fechas bloqueadas en el calendario
CREATE TABLE calendario_bloqueado (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  fecha DATE NOT NULL UNIQUE,
  motivo VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_disponible ON productos(disponible);
CREATE INDEX idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX idx_cotizaciones_fecha ON cotizaciones(fecha_evento);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_reservas_fecha ON reservas(fecha_evento);
CREATE INDEX idx_galeria_categoria ON galeria(categoria);

-- Función para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = TIMEZONE('utc', NOW());
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cotizaciones_updated_at BEFORE UPDATE ON cotizaciones
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservas_updated_at BEFORE UPDATE ON reservas
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar categorías por defecto
INSERT INTO categorias (nombre, descripcion) VALUES
('Sillas', 'Diferentes tipos de sillas para eventos'),
('Mesas', 'Mesas de diversos tamaños y estilos'),
('Decoración', 'Elementos decorativos'),
('Iluminación', 'Sistemas de iluminación'),
('Vajilla', 'Platos, vasos, cubiertos'),
('Mantelería', 'Manteles y servilletas'),
('Audio', 'Equipos de sonido');

-- Row Level Security (RLS) Policies
-- Habilitar RLS en las tablas
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserva_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeria ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendario_bloqueado ENABLE ROW LEVEL SECURITY;

-- Políticas para acceso público (lectura)
CREATE POLICY "Public can view categories" ON categorias FOR SELECT USING (true);
CREATE POLICY "Public can view available products" ON productos FOR SELECT USING (disponible = true);
CREATE POLICY "Public can view gallery" ON galeria FOR SELECT USING (true);
CREATE POLICY "Public can view confirmed reservations" ON reservas FOR SELECT USING (estado IN ('confirmada', 'pendiente'));

-- Políticas para inserción pública (cotizaciones)
CREATE POLICY "Public can insert quotations" ON cotizaciones FOR INSERT WITH CHECK (true);

-- Políticas para admin (requiere autenticación)
-- Nota: Ajusta estas políticas según tu esquema de autenticación
CREATE POLICY "Authenticated users can manage products" ON productos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage quotations" ON cotizaciones
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage reservations" ON reservas
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage gallery" ON galeria
  FOR ALL USING (auth.role() = 'authenticated');

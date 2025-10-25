# ⚡ Quick Start - Creaparty

Guía rápida para tener Creaparty funcionando en 10 minutos.

---

## 🚀 Opción 1: Solo Ver el Diseño (Sin Backend)

Si solo quieres ver los estilos y el diseño sin configurar base de datos:

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env (puedes dejarlo vacío por ahora)
touch .env

# 3. Iniciar desarrollo
npm run dev
```

Abre `http://localhost:5173` y explora:
- Landing page con animaciones
- Catálogo (sin productos aún)
- Galería (sin imágenes aún)
- Formulario de cotización (no enviará emails)

---

## 🔧 Opción 2: Setup Completo (20 minutos)

### Paso 1: Supabase (10 min)

1. Ve a https://supabase.com y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a **SQL Editor** → **New Query**
4. Copia y pega todo el contenido de `supabase-schema.sql`
5. Haz clic en **Run**
6. Ve a **Settings** → **API** y copia:
   - Project URL
   - anon public key

### Paso 2: Variables de Entorno (1 min)

Crea un archivo `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_aqui
```

### Paso 3: Crear Usuario Admin (2 min)

1. En Supabase, ve a **Authentication** → **Users**
2. Haz clic en **Add user** → **Create new user**
3. Email: `admin@creaparty.com` (o el que prefieras)
4. Password: (crea una contraseña)
5. Activa: **Auto Confirm User**
6. Haz clic en **Create user**

### Paso 4: Iniciar Proyecto (1 min)

```bash
npm install
npm run dev
```

### Paso 5: Probar (5 min)

1. Abre `http://localhost:5173`
2. Navega por las páginas públicas
3. Ve a `/admin/login` y entra con tu usuario admin
4. Explora el dashboard

---

## 📸 Agregar Contenido de Prueba

### Productos

1. Ve a Supabase → **Table Editor** → `productos`
2. Haz clic en **Insert row**
3. Completa:
   - nombre: "Silla Elegante"
   - descripcion: "Silla moderna para eventos"
   - precio: 15.00
   - stock: 50
   - disponible: true
   - imagen_url: (por ahora usa una URL de placeholder como `https://placehold.co/400`)
4. Guarda

Repite para agregar más productos.

### Galería

1. Ve a Supabase → **Table Editor** → `galeria`
2. Inserta filas con:
   - titulo: "Evento Boda Elegante"
   - categoria: "bodas"
   - url: (usa placeholder: `https://placehold.co/600/autumn/white?text=Boda`)

---

## 🎨 Ver Estilos Modernos

Abre el proyecto y ve:

**Landing Page** (`/`)
- Blobs animados en el fondo
- Gradientes de colores otoñales
- Botones con efecto glassmorphism
- Animaciones suaves

**Catálogo** (`/catalogo`)
- Cards con efecto hover
- Filtros por categoría
- Barra de búsqueda moderna

**Disponibilidad** (`/disponibilidad`)
- Calendario interactivo
- Vista de fechas disponibles

**Galería** (`/galeria`)
- Grid de imágenes
- Lightbox al hacer clic
- Filtros por categoría

---

## 📧 Configurar Emails (Opcional - 10 min)

Solo si quieres que los emails funcionen:

1. Crea cuenta en https://resend.com
2. Ve a **API Keys** y crea una
3. Agrégala a tu `.env`:
   ```env
   VITE_RESEND_API_KEY=tu_api_key
   ```
4. En `api/send-email.js` línea 17, cambia:
   ```javascript
   from: 'Creaparty <noreply@tudominio.com>',
   ```
   Por tu email verificado o usa el de prueba de Resend.

---

## 🎯 Próximos Pasos

Una vez funcionando:

1. ✅ Personaliza los textos en las páginas
2. ✅ Cambia los colores si quieres (en `tailwind.config.js`)
3. ✅ Agrega tus productos reales
4. ✅ Sube imágenes de tus eventos
5. ✅ Lee [SETUP_GUIDE.md](SETUP_GUIDE.md) para deploy en Vercel

---

## 🐛 Problemas Comunes

**No veo productos en el catálogo**
- Asegúrate de haber insertado productos en Supabase
- Verifica que `disponible` esté en `true`

**Error de conexión a Supabase**
- Revisa que las variables de entorno estén correctas
- Reinicia el servidor (`Ctrl+C` y `npm run dev` de nuevo)

**No puedo hacer login**
- Verifica que el usuario exista en Supabase Auth
- Verifica que el email y contraseña sean correctos

**Las imágenes no cargan**
- Por ahora usa URLs de placeholder
- Para imágenes reales, configura Storage en Supabase (ver SETUP_GUIDE.md)

---

## 📚 Documentación Completa

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Configuración completa
- [DESIGN_GUIDE.md](DESIGN_GUIDE.md) - Guía de estilos
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Resumen del proyecto
- [README.md](README.md) - Vista general

---

**¡Listo! Ahora tienes Creaparty funcionando localmente. 🎉**

¿Necesitas ayuda? Consulta los archivos de documentación o los docs oficiales de cada herramienta.

# 🎛️ Guía del Panel de Administración - Creaparty

## ✅ TODAS las Funcionalidades del Admin Están Completas

He creado **4 páginas completamente funcionales** para el panel de administración:

1. ✅ **Gestión de Productos** - CRUD completo
2. ✅ **Gestión de Cotizaciones** - Ver, aprobar/rechazar, crear reservas
3. ✅ **Gestión de Reservas** - Ver, cambiar estados
4. ✅ **Gestión de Galería** - Subir/eliminar imágenes

---

## 📁 Archivos Creados

```
src/pages/admin/
├── ProductsManagement.jsx      ✅ NUEVO
├── QuotationsManagement.jsx    ✅ NUEVO
├── ReservationsManagement.jsx  ✅ NUEVO
├── GalleryManagement.jsx       ✅ NUEVO
├── Dashboard.jsx               ✅ ACTUALIZADO
└── Login.jsx                   (ya existía)
```

---

## 🔐 Acceso al Panel Admin

### 1. Iniciar Sesión

**URL:** `http://localhost:5173/admin/login`

**Credenciales:** Las que creaste en Supabase (Authentication → Users)

### 2. Navegación

Una vez dentro, verás el sidebar con:
- 📊 Dashboard (estadísticas básicas)
- 📦 Productos
- 📅 Reservas
- 📋 Cotizaciones
- 🖼️ Galería

---

## 1️⃣ Gestión de Productos

### Funcionalidades Completas:

✅ **Ver todos los productos** en un grid moderno con cards
✅ **Buscar productos** por nombre
✅ **Crear nuevo producto** con modal
✅ **Editar producto** existente
✅ **Eliminar producto** con confirmación
✅ **Ver categoría** de cada producto
✅ **Ver disponibilidad** (disponible/no disponible)
✅ **Ver stock** y precio

### Campos del Formulario:

- **Nombre** (requerido)
- **Descripción** (opcional)
- **Precio por día** (requerido, número decimal)
- **Stock disponible** (requerido, número entero)
- **Categoría** (requerido, selector con categorías de la BD)
- **URL de imagen** (opcional)
- **Disponible** (checkbox)

### Cómo Usar:

1. Clic en **"Nuevo Producto"**
2. Llenar el formulario
3. Para la imagen, usa una URL (ej: de Imgur, Unsplash, etc)
4. Guardar

Para editar: Clic en **"Editar"** en la card del producto

---

## 2️⃣ Gestión de Cotizaciones

### Funcionalidades Completas:

✅ **Ver todas las cotizaciones** recibidas
✅ **Filtrar por estado** (Todas, Pendiente, Aprobada, Rechazada)
✅ **Buscar** por nombre o email
✅ **Ver detalles completos** de cada cotización
✅ **Aprobar cotización** → Envía email automático al cliente
✅ **Rechazar cotización** → Pide motivo y envía email
✅ **Convertir a reserva** → Crea una reserva automáticamente

### Información Visible:

- Nombre del cliente
- Email y teléfono
- Tipo de evento
- Fecha del evento
- Número de personas
- Mensaje adicional (si lo dejaron)
- Estado actual
- Fecha de recepción

### Estados de Cotización:

- 🟡 **Pendiente** - Recién recibida, esperando revisión
- 🟢 **Aprobada** - Admin aprobó, cliente notificado
- 🔴 **Rechazada** - Admin rechazó, cliente notificado con motivo

### Acciones Disponibles:

**Para cotizaciones PENDIENTES:**
- ✅ Aprobar (envía email de aprobación)
- 📅 Crear Reserva (crea reserva y marca como aprobada)
- ❌ Rechazar (pide motivo y envía email)

**Para cotizaciones APROBADAS:**
- 📅 Crear Reserva

---

## 3️⃣ Gestión de Reservas

### Funcionalidades Completas:

✅ **Ver todas las reservas**
✅ **Filtrar por estado** (Todas, Pendiente, Confirmada, Completada, Cancelada)
✅ **Buscar** por nombre de cliente
✅ **Cambiar estado** de la reserva
✅ **Ver eventos pasados** (alerta visual)
✅ **Enviar email de confirmación** automático

### Información Visible:

- Nombre del cliente
- Email y teléfono
- Tipo de evento
- Fecha del evento
- Número de personas
- Notas adicionales
- Estado actual
- Fecha de creación
- ⚠️ Alerta si el evento ya pasó

### Estados de Reserva:

- 🟡 **Pendiente** - Recién creada, esperando confirmación
- 🔵 **Confirmada** - Cliente confirmó, fecha bloqueada
- 🟢 **Completada** - Evento realizado exitosamente
- 🔴 **Cancelada** - Reserva cancelada

### Cambios de Estado:

Desde cualquier estado puedes:
- **Confirmar** → Envía email de confirmación al cliente
- **Completar** → Marca como evento completado
- **Cancelar** → Marca como cancelada (libera la fecha)

---

## 4️⃣ Gestión de Galería

### Funcionalidades Completas:

✅ **Ver todas las imágenes** en grid
✅ **Filtrar por categoría** (Todas, Bodas, Cumpleaños, Corporativos, Otros)
✅ **Agregar nueva imagen** con modal
✅ **Eliminar imagen** con confirmación
✅ **Preview de imagen** antes de agregar
✅ **Ver información** (título, descripción, categoría)

### Campos del Formulario:

- **URL de imagen** (requerido) - Link directo a la imagen
- **Título** (opcional) - Ej: "Boda Elegante en Jardín"
- **Descripción** (opcional) - Descripción breve del evento
- **Categoría** (requerido) - Bodas, Cumpleaños, Corporativos, Otros

### Cómo Agregar Imágenes:

**Opción 1: Usar servicio gratuito (Recomendado para empezar)**

1. Sube tu imagen a [Imgur.com](https://imgur.com) (gratis, sin registro)
2. Clic derecho en la imagen → "Copiar dirección de imagen"
3. Pega la URL en el campo "URL de imagen"
4. Verás un preview
5. Completa los demás campos
6. Guardar

**Opción 2: Configurar Supabase Storage**

Ver [SETUP_GUIDE.md](SETUP_GUIDE.md) sección "Configurar Storage"

---

## 📧 Emails Automáticos

El sistema envía emails automáticamente en estos casos:

### 1. Nueva Cotización → Admin
Cuando un cliente envía una cotización, recibes un email con todos los detalles.

### 2. Cotización Aprobada → Cliente
Cuando apruebas una cotización, el cliente recibe:
- Confirmación de aprobación
- Detalles de su evento
- Información de contacto

### 3. Cotización Rechazada → Cliente
Cuando rechazas una cotización, el cliente recibe:
- Notificación del rechazo
- Motivo (si lo proporcionaste)
- Invitación a contactarte

### 4. Reserva Confirmada → Cliente
Cuando confirmas una reserva, el cliente recibe:
- Confirmación de la reserva
- Detalles del evento
- Próximos pasos

**Nota:** Los emails requieren configuración de Resend (ver SETUP_GUIDE.md)

---

## 🎨 Características de Diseño

Todas las páginas admin tienen:

✅ **Diseño moderno** con el mismo estilo otoñal del sitio público
✅ **Cards con glassmorphism** y sombras suaves
✅ **Animaciones fluidas** con Framer Motion
✅ **Modales modernos** con backdrop blur
✅ **Estados visuales claros** con colores distintivos
✅ **Responsive** - Funciona en móvil, tablet y desktop
✅ **Loading states** - Spinners mientras carga
✅ **Confirmaciones** - Pide confirmación antes de eliminar

---

## 🚀 Próximos Pasos

### Para Empezar a Usar:

1. **Configura Supabase** (si no lo has hecho)
   - Ejecuta el SQL del archivo `supabase-schema.sql`
   - Crea tu usuario admin

2. **Inicia sesión** en `/admin/login`

3. **Agrega contenido:**
   - Crea categorías (ya están precargadas con el SQL)
   - Agrega productos
   - Las cotizaciones llegarán del sitio público
   - Sube imágenes a la galería

### Para Producción:

4. **Configura Resend** para emails (ver SETUP_GUIDE.md)

5. **Deploy en Vercel** (ver SETUP_GUIDE.md)

---

## 📊 Dashboard (Futuro)

Actualmente el dashboard muestra estadísticas de ejemplo. Puedes mejorarlo para mostrar:

- Número real de cotizaciones pendientes
- Reservas del mes actual
- Total de productos
- Eventos completados

Para esto, necesitarías hacer queries a Supabase y actualizar los valores.

---

## 🐛 Solución de Problemas

### "No puedo ver los productos/cotizaciones/etc"

**Solución:** Verifica que:
1. Supabase esté configurado (URL y Key en `.env`)
2. El SQL schema esté ejecutado
3. Tengas datos en las tablas

### "Los emails no se envían"

**Solución:**
1. Verifica que Resend esté configurado
2. La función serverless en `api/send-email.js` requiere deploy en Vercel
3. En desarrollo local, los emails pueden fallar (es normal)

### "Error al eliminar producto"

**Causa:** Puede tener relaciones con otras tablas (ej: en reservas)

**Solución:** Elimina primero las reservas asociadas, luego el producto

---

## 💡 Tips

1. **Usa URLs de Imgur** para imágenes mientras pruebas (es gratis y rápido)

2. **Prueba el flujo completo:**
   - Envía una cotización desde el sitio público
   - Apruébala desde el admin
   - Verifica que llegó el email
   - Conviértela en reserva
   - Confirma la reserva

3. **Categorías predefinidas:** El SQL ya creó 7 categorías:
   - Sillas
   - Mesas
   - Decoración
   - Iluminación
   - Vajilla
   - Mantelería
   - Audio

4. **Estados visuales:** Los colores ayudan a identificar rápidamente:
   - 🟡 Amarillo = Pendiente/En espera
   - 🔵 Azul = Confirmada
   - 🟢 Verde = Completada/Aprobada
   - 🔴 Rojo = Cancelada/Rechazada

---

## 📚 Archivos Relacionados

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Configuración completa de Supabase y Resend
- [QUICK_START.md](QUICK_START.md) - Inicio rápido del proyecto
- [DESIGN_GUIDE.md](DESIGN_GUIDE.md) - Guía de estilos
- [supabase-schema.sql](supabase-schema.sql) - Schema de base de datos

---

**¡Todo el panel de administración está listo y funcional! 🎉**

Ahora puedes gestionar completamente tu negocio de eventos desde el admin.

# 🎉 Guía de Configuración Completa - Creaparty

Esta guía te llevará paso a paso para configurar y deployar tu aplicación Creaparty.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Supabase](#configuración-de-supabase)
3. [Configuración del Proyecto](#configuración-del-proyecto)
4. [Configuración de Resend (Email)](#configuración-de-resend-email)
5. [Desarrollo Local](#desarrollo-local)
6. [Deploy en Vercel](#deploy-en-vercel)
7. [Gestión de Contenido](#gestión-de-contenido)
8. [Solución de Problemas](#solución-de-problemas)

---

## 🎯 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18 o superior ([Descargar](https://nodejs.org/))
- **Git** ([Descargar](https://git-scm.com/))
- Una cuenta de **Supabase** ([Crear cuenta](https://supabase.com/))
- Una cuenta de **Resend** ([Crear cuenta](https://resend.com/))
- Una cuenta de **Vercel** ([Crear cuenta](https://vercel.com/))

---

## 🗄️ Configuración de Supabase

### Paso 1: Crear un Proyecto en Supabase

1. Ve a [Supabase Dashboard](https://app.supabase.com/)
2. Haz clic en **"New Project"**
3. Completa los datos:
   - **Name**: Creaparty
   - **Database Password**: Elige una contraseña segura (guárdala)
   - **Region**: Elige la más cercana a tu ubicación
4. Haz clic en **"Create new project"**
5. Espera 2-3 minutos mientras Supabase configura tu proyecto

### Paso 2: Configurar la Base de Datos

1. En el dashboard de Supabase, ve a **SQL Editor** (icono en el menú lateral)
2. Haz clic en **"New Query"**
3. Copia todo el contenido del archivo `supabase-schema.sql` del proyecto
4. Pégalo en el editor y haz clic en **"Run"**
5. Deberías ver el mensaje: **"Success. No rows returned"**

### Paso 3: Configurar Storage (Almacenamiento de Imágenes)

1. Ve a **Storage** en el menú lateral
2. Haz clic en **"Create a new bucket"**
3. Configura el bucket:
   - **Name**: `productos`
   - **Public**: ✅ Activar (para que las imágenes sean públicas)
   - Haz clic en **"Create bucket"**
4. Repite el proceso para crear otro bucket llamado `galeria`

### Paso 4: Configurar Políticas de Storage

Para cada bucket (`productos` y `galeria`):

1. Haz clic en el bucket
2. Ve a **Policies**
3. Haz clic en **"New Policy"**
4. Selecciona **"Allow public read access"** para lectura pública
5. Para escritura (upload), crea una política personalizada:

```sql
-- Política para uploads autenticados
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'productos' AND auth.role() = 'authenticated');
```

### Paso 5: Obtener las Credenciales

1. Ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL** (ejemplo: `https://abcdefgh.supabase.co`)
   - **anon public** key (una clave larga que empieza con `eyJ...`)
3. Guárdalos, los necesitarás en el siguiente paso

### Paso 6: Crear Usuario Admin

1. Ve a **Authentication** → **Users**
2. Haz clic en **"Add user"** → **"Create new user"**
3. Completa:
   - **Email**: tu-email@ejemplo.com
   - **Password**: crea una contraseña segura
   - **Auto Confirm User**: ✅ Activar
4. Haz clic en **"Create user"**
5. Guarda estas credenciales, las usarás para acceder al panel admin

---

## ⚙️ Configuración del Proyecto

### Paso 1: Instalar Dependencias

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

### Paso 2: Configurar Variables de Entorno

1. Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

2. Abre el archivo `.env` y completa con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon_publica_aqui
VITE_RESEND_API_KEY=tu_api_key_de_resend
```

⚠️ **Importante**: Nunca compartas ni subas a Git tus claves reales. El archivo `.env` ya está en `.gitignore`.

---

## 📧 Configuración de Resend (Email)

### Paso 1: Crear Cuenta y API Key

1. Ve a [Resend.com](https://resend.com/) y crea una cuenta
2. Ve a **API Keys** en el dashboard
3. Haz clic en **"Create API Key"**
4. Asigna un nombre (ejemplo: "Creaparty Production")
5. Copia la API Key generada
6. Pégala en tu archivo `.env` como `VITE_RESEND_API_KEY`

### Paso 2: Verificar Dominio (Opcional pero Recomendado)

Para emails en producción con tu propio dominio:

1. Ve a **Domains** en Resend
2. Haz clic en **"Add Domain"**
3. Ingresa tu dominio (ejemplo: `creaparty.com`)
4. Sigue las instrucciones para agregar los registros DNS
5. Espera la verificación (puede tardar hasta 48 horas)

**Nota**: Para desarrollo, puedes usar el dominio por defecto de Resend (`onboarding@resend.dev`).

### Paso 3: Crear Función de Email (Backend)

Debido a que Resend requiere una API key privada, necesitas crear una función serverless en Vercel:

1. Crea una carpeta `api/` en la raíz del proyecto:

```bash
mkdir -p api
```

2. Crea el archivo `api/send-email.js`:

```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, html } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'Creaparty <noreply@tudominio.com>',
      to,
      subject,
      html,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

3. Instala Resend en el proyecto:

```bash
npm install resend
```

---

## 🚀 Desarrollo Local

### Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Rutas Principales

**Públicas:**
- `/` - Inicio
- `/catalogo` - Catálogo de productos
- `/galeria` - Galería de eventos
- `/disponibilidad` - Calendario de disponibilidad
- `/cotizacion` - Formulario de cotización

**Admin:**
- `/admin/login` - Login de administrador
- `/admin/dashboard` - Dashboard principal
- `/admin/productos` - Gestión de productos
- `/admin/reservas` - Gestión de reservas
- `/admin/cotizaciones` - Gestión de cotizaciones
- `/admin/galeria` - Gestión de galería

### Credenciales de Admin

Usa las credenciales que creaste en Supabase (Paso 6 de Configuración de Supabase).

---

## 🌐 Deploy en Vercel

### Opción 1: Deploy desde GitHub (Recomendado)

1. **Sube tu código a GitHub**:

```bash
git init
git add .
git commit -m "Initial commit - Creaparty"
git branch -M main
git remote add origin https://github.com/tu-usuario/creaparty.git
git push -u origin main
```

2. **Conecta con Vercel**:
   - Ve a [Vercel Dashboard](https://vercel.com/dashboard)
   - Haz clic en **"New Project"**
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite

3. **Configurar Variables de Entorno**:
   - En la configuración del proyecto en Vercel
   - Ve a **Settings** → **Environment Variables**
   - Agrega las siguientes variables:
     ```
     VITE_SUPABASE_URL=tu_url_de_supabase
     VITE_SUPABASE_ANON_KEY=tu_clave_anon
     RESEND_API_KEY=tu_api_key_de_resend
     ```
   - **Importante**: `RESEND_API_KEY` NO lleva el prefijo `VITE_` porque es privada

4. **Deploy**:
   - Haz clic en **"Deploy"**
   - Espera 2-3 minutos
   - Tu sitio estará en línea en `https://tu-proyecto.vercel.app`

### Opción 2: Deploy desde CLI

```bash
# Instala Vercel CLI
npm i -g vercel

# Deploy
vercel

# Sigue las instrucciones en la terminal
```

### Configurar Dominio Personalizado (Opcional)

1. En Vercel, ve a tu proyecto → **Settings** → **Domains**
2. Haz clic en **"Add"**
3. Ingresa tu dominio (ejemplo: `creaparty.com`)
4. Sigue las instrucciones para configurar los registros DNS
5. Espera la verificación (puede tardar hasta 48 horas)

---

## 📝 Gestión de Contenido

### Agregar Productos

1. Inicia sesión en `/admin/login`
2. Ve a **Productos** en el menú lateral
3. Haz clic en **"Agregar Producto"**
4. Completa los campos:
   - Nombre del producto
   - Descripción
   - Precio por día
   - Categoría
   - Stock disponible
   - Imagen (sube desde tu computadora)
5. Haz clic en **"Guardar"**

### Gestionar Galería

1. Ve a **Galería** en el admin
2. Haz clic en **"Subir Imágenes"**
3. Selecciona las imágenes del evento
4. Asigna:
   - Título (opcional)
   - Descripción (opcional)
   - Categoría (Bodas, Cumpleaños, etc.)
5. Las imágenes aparecerán automáticamente en la galería pública

### Gestionar Cotizaciones

1. Ve a **Cotizaciones**
2. Verás una lista de todas las cotizaciones recibidas
3. Para cada cotización puedes:
   - Ver detalles completos
   - Aprobar (convierte en reserva)
   - Rechazar
   - Enviar email de respuesta al cliente

### Gestionar Reservas

1. Ve a **Reservas**
2. Cambia el estado de las reservas:
   - **Pendiente**: Recién creada, esperando confirmación
   - **Confirmada**: Cliente confirmó, fecha bloqueada
   - **Completada**: Evento realizado exitosamente
   - **Cancelada**: Reserva cancelada

---

## 🎨 Personalización de Diseño

### Colores

Los colores se definen en [tailwind.config.js](tailwind.config.js). Para cambiarlos:

```javascript
colors: {
  autumn: {
    // Modifica estos valores
    500: '#c97d56', // Color principal
    // ...
  }
}
```

### Tipografía

La fuente principal es **Inter**. Para cambiarla, edita [src/index.css](src/index.css):

```css
@import url('https://fonts.googleapis.com/css2?family=TuFuente:wght@300;400;600;700&display=swap');
```

Y actualiza en `tailwind.config.js`:

```javascript
fontFamily: {
  sans: ['TuFuente', 'sans-serif'],
}
```

---

## 🐛 Solución de Problemas

### Error: "Invalid API Key" en Supabase

**Solución**: Verifica que las variables de entorno en `.env` sean correctas y reinicia el servidor de desarrollo.

### Las imágenes no se cargan

**Solución**:
1. Verifica que los buckets de storage en Supabase sean públicos
2. Revisa las políticas de acceso
3. Asegúrate de que las URLs de las imágenes sean correctas

### Error al enviar emails

**Solución**:
1. Verifica que la API key de Resend sea correcta
2. Si usas dominio personalizado, asegúrate de que esté verificado
3. Revisa los logs en el dashboard de Resend

### El calendario no muestra reservas

**Solución**:
1. Verifica que haya reservas con estado "confirmada" o "pendiente"
2. Revisa las políticas RLS en Supabase para la tabla `reservas`
3. Abre la consola del navegador para ver errores

### Error 404 en rutas al hacer refresh

**Solución**: Vercel debería configurar automáticamente el SPA. Si no, crea un archivo `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 📚 Recursos Adicionales

- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de React](https://react.dev/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Resend](https://resend.com/docs)
- [Documentación de Vercel](https://vercel.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)

---

## 🎯 Próximos Pasos

Una vez que todo esté funcionando:

1. ✅ Personaliza los textos y contenido
2. ✅ Agrega tus productos reales
3. ✅ Sube imágenes de tus eventos a la galería
4. ✅ Configura tu dominio personalizado
5. ✅ Prueba el flujo completo de cotización
6. ✅ Configura analytics (Google Analytics, Vercel Analytics)
7. ✅ Agrega más funcionalidades según necesites

---

## 💡 Consejos Pro

- **Backups**: Supabase hace backups automáticos, pero considera exportar tu base de datos regularmente
- **SEO**: Agrega meta tags personalizados para cada página
- **Performance**: Optimiza las imágenes antes de subirlas (usa formatos WebP)
- **Seguridad**: Nunca expongas claves privadas en el frontend
- **Testing**: Prueba en diferentes navegadores y dispositivos antes de lanzar

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa esta guía completamente
2. Busca el error en Google
3. Consulta la documentación oficial de cada herramienta
4. Revisa los issues en GitHub del proyecto

---

**¡Felicidades! 🎉 Tu aplicación Creaparty está lista para transformar eventos.**

---

*Última actualización: Octubre 2025*

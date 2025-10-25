# 🎉 Creaparty - Gestión de Eventos y Alquiler de Mobiliario

Aplicación web moderna para gestión de eventos, alquiler de mobiliario y decoración con panel de administración completo.

![React](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E)

## ✨ Características

### Para Clientes
- 🏠 **Landing page moderna** con diseño innovador y animaciones fluidas
- 📦 **Catálogo interactivo** de productos con filtros y búsqueda
- 📅 **Calendario de disponibilidad** en tiempo real
- 🖼️ **Galería de eventos** realizados por categorías
- 💬 **Sistema de cotizaciones** con formulario intuitivo
- 📧 **Notificaciones por email** automáticas
- 📱 **Diseño responsive** optimizado para móviles

### Para Administradores
- 🔐 **Panel de administración** protegido con autenticación
- 📊 **Dashboard** con métricas clave
- 🛠️ **CRUD completo** de productos y mobiliario
- 📋 **Gestión de cotizaciones** y conversión a reservas
- 🗓️ **Gestión de reservas** con estados y seguimiento
- 🎨 **Gestión de galería** con categorización
- 📆 **Bloqueo de fechas** en calendario

## 🎨 Diseño

- **Paleta de colores**: Tonos otoñales pastel (autumn, rust, sage, terracotta, cream)
- **Efectos modernos**: Glassmorphism, neumorphism, gradientes dinámicos
- **Animaciones**: Transiciones suaves con Framer Motion
- **Tipografía**: Inter (Google Fonts)
- **Componentes**: Cards orgánicos, inputs flotantes, botones con efectos

## 🛠️ Stack Tecnológico

**Frontend:**
- React 18.3
- Vite 5.4
- Tailwind CSS 3.4
- Framer Motion (animaciones)
- React Router DOM (navegación)
- React Hook Form + Zod (formularios y validación)
- Lucide React (iconos)

**Backend/Database:**
- Supabase (Base de datos PostgreSQL + Auth + Storage)
- Resend (servicio de emails)

**Deploy:**
- Vercel (hosting y serverless functions)

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/creaparty.git
cd creaparty
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anon
VITE_RESEND_API_KEY=tu_api_key (opcional para desarrollo)
```

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`

## 📖 Documentación Completa

Para una guía detallada de configuración, consulta [SETUP_GUIDE.md](SETUP_GUIDE.md) que incluye:

- Configuración paso a paso de Supabase
- Setup de base de datos con SQL
- Configuración de Storage para imágenes
- Setup de Resend para emails
- Deploy en Vercel
- Gestión de contenido
- Solución de problemas

## 📁 Estructura del Proyecto

```
creaparty/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes reutilizables
│   │   ├── layout/          # Navbar, Footer
│   │   └── features/        # Componentes específicos
│   ├── pages/
│   │   ├── public/          # Páginas públicas
│   │   └── admin/           # Panel de administración
│   ├── hooks/               # Custom hooks (useAuth, etc)
│   ├── lib/                 # Utilidades
│   ├── config/              # Configuración (Supabase)
│   ├── services/            # Servicios de API
│   ├── store/               # Estado global
│   └── assets/              # Imágenes, iconos
├── api/                     # Serverless functions (Vercel)
├── public/                  # Assets estáticos
└── supabase-schema.sql      # Schema de base de datos
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linter
```

## 🎯 Roadmap

- [ ] Sistema de pagos (integración con Stripe/PayPal)
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Multi-idioma (ES/EN)
- [ ] PWA (Progressive Web App)
- [ ] Exportar reportes a PDF
- [ ] Chat en vivo con clientes
- [ ] Sistema de descuentos por temporada

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 💬 Contacto

**Creaparty** - info@creaparty.com

Link del proyecto: [https://github.com/tu-usuario/creaparty](https://github.com/tu-usuario/creaparty)

---

Hecho con ❤️ para crear eventos inolvidables

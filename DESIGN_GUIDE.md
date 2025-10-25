# 🎨 Guía de Diseño - Creaparty

Esta guía te muestra cómo usar el sistema de diseño moderno e innovador de Creaparty.

---

## 🌈 Paleta de Colores

### Colores Principales (Autumn)

```jsx
// Tonos claros
bg-autumn-50   // Fondo muy claro
bg-autumn-100  // Fondo claro
bg-autumn-200  // Bordes suaves

// Tonos medios
bg-autumn-400  // Acentos
bg-autumn-500  // Principal
bg-autumn-600  // Hover states

// Tonos oscuros
bg-autumn-800  // Textos
bg-autumn-900  // Textos oscuros
```

### Colores Secundarios

```jsx
// Rust (Óxido) - Para CTAs
bg-rust-500
text-rust-600

// Sage (Salvia) - Para elementos naturales
bg-sage-500
text-sage-700

// Terracotta - Para acentos cálidos
bg-terracotta-500

// Cream (Crema) - Para fondos suaves
bg-cream-100
```

---

## ✨ Efectos Modernos

### 1. Glassmorphism (Efecto Vidrio)

```jsx
// Card con efecto vidrio
<div className="glass-card p-6 rounded-3xl">
  Contenido aquí
</div>

// Card con efecto vidrio + hover
<div className="glass-card-hover p-6 rounded-3xl">
  Contenido interactivo
</div>
```

**Resultado**: Fondo translúcido con blur, bordes sutiles.

### 2. Neumorphism (Efecto 3D Suave)

```jsx
<div className="neuro-card p-8 rounded-3xl">
  Contenido con efecto 3D sutil
</div>
```

**Resultado**: Sombras internas y externas que crean profundidad.

### 3. Gradientes Dinámicos

```jsx
// Gradiente de fondo
<div className="bg-gradient-to-br from-autumn-500 to-rust-500">
  Contenido
</div>

// Texto con gradiente
<h1 className="gradient-text">
  Título con gradiente
</h1>
```

### 4. Formas Orgánicas

```jsx
// Forma orgánica simple
<div className="organic-shape bg-autumn-200 w-64 h-64">
  Contenido
</div>

// Forma orgánica alternativa
<div className="organic-shape-2 bg-rust-200 w-96 h-96">
  Contenido
</div>
```

---

## 🎯 Componentes Base

### Botones

```jsx
import Button from './components/ui/Button';

// Botón primario (gradiente)
<Button variant="primary" size="lg">
  Solicitar Cotización
</Button>

// Botón secundario (glassmorphism)
<Button variant="secondary" size="md">
  Ver Más
</Button>

// Botón ghost (transparente)
<Button variant="ghost" size="sm">
  Cancelar
</Button>
```

### Cards

```jsx
import Card from './components/ui/Card';

// Card con efecto vidrio
<Card variant="glass">
  Contenido de la card
</Card>

// Card con efecto 3D
<Card variant="neuro">
  Contenido con neumorphism
</Card>

// Card sólida
<Card variant="solid">
  Contenido sólido
</Card>

// Desactivar hover
<Card variant="glass" hover={false}>
  Sin efecto hover
</Card>
```

### Inputs

```jsx
import Input from './components/ui/Input';

// Input estándar
<Input
  label="Email"
  type="email"
  placeholder="tu@email.com"
/>

// Input con label flotante
<Input
  label="Nombre"
  floating={true}
  placeholder=" "
/>

// Con error
<Input
  label="Teléfono"
  error="Este campo es requerido"
/>
```

---

## 🎬 Animaciones

### Animaciones con Framer Motion

```jsx
import { motion } from 'framer-motion';

// Fade in al aparecer
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Contenido
</motion.div>

// Slide up al aparecer
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Contenido que sube
</motion.div>

// Animación al hacer scroll
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  Se anima al entrar en viewport
</motion.div>

// Scale al hover
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Interactivo
</motion.div>
```

### Clases de Animación CSS

```jsx
// Fade up con delay
<div className="animate-fade-up animation-delay-200">
  Aparece con delay
</div>

// Float (movimiento flotante continuo)
<div className="animate-float">
  Flotante
</div>

// Glow (brillo pulsante)
<div className="animate-glow">
  Efecto de brillo
</div>
```

---

## 🔤 Tipografía

### Tamaños de Texto Display

```jsx
// Extra grande
<h1 className="text-display-2xl font-bold gradient-text">
  Título Hero
</h1>

// Grande
<h2 className="text-display-xl font-bold">
  Título Principal
</h2>

// Mediano
<h3 className="text-display-md font-semibold">
  Subtítulo
</h3>
```

### Headers de Sección

```jsx
// Header con gradiente
<h2 className="section-header">
  Nuestros Servicios
</h2>

// Subtítulo de sección
<p className="section-subheader">
  Descripción de la sección
</p>
```

---

## 🎨 Efectos Especiales

### Background con Mesh Gradient

```jsx
<div className="bg-mesh min-h-screen">
  Contenido con fondo de gradiente mesh
</div>
```

### Blobs Animados (Fondo Decorativo)

```jsx
<div className="relative overflow-hidden">
  {/* Blobs de fondo */}
  <motion.div
    animate={{
      scale: [1, 1.2, 1],
      rotate: [0, 90, 0],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    }}
    className="blob top-1/4 left-1/4 w-96 h-96 bg-autumn-300"
  />

  {/* Contenido principal */}
  <div className="relative z-10">
    Tu contenido aquí
  </div>
</div>
```

### Scrollbar Personalizado

```jsx
<div className="custom-scrollbar overflow-y-auto h-96">
  Contenido scrolleable con scrollbar personalizado
</div>
```

---

## 🧭 Navegación

### Links con Animación

```jsx
<a href="/catalogo" className="nav-link">
  Catálogo
</a>

// Activo
<a href="/catalogo" className="nav-link active">
  Catálogo
</a>
```

---

## 📱 Responsive Design

### Breakpoints

```jsx
// Mobile first
<div className="
  grid
  grid-cols-1          // Mobile: 1 columna
  md:grid-cols-2       // Tablet: 2 columnas
  lg:grid-cols-3       // Desktop: 3 columnas
  xl:grid-cols-4       // Large: 4 columnas
  gap-6
">
  Cards
</div>
```

### Texto Responsive

```jsx
<h1 className="
  text-4xl           // Mobile
  md:text-6xl        // Tablet
  lg:text-8xl        // Desktop
  font-bold
  gradient-text
">
  Título Responsive
</h1>
```

---

## 🎯 Patrones Comunes

### Hero Section Moderna

```jsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Blobs de fondo */}
  <div className="absolute inset-0">
    <motion.div
      animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
      transition={{ duration: 20, repeat: Infinity }}
      className="blob top-1/4 left-1/4 w-96 h-96 bg-autumn-300"
    />
  </div>

  {/* Contenido */}
  <div className="relative z-10 container mx-auto px-4 text-center">
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-7xl font-bold gradient-text mb-6"
    >
      Tu Título
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-xl text-autumn-600 mb-8"
    >
      Tu descripción
    </motion.p>

    <Button variant="primary" size="lg">
      Call to Action
    </Button>
  </div>
</section>
```

### Grid de Cards Modernas

```jsx
<div className="card-grid">
  {items.map((item, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full">
        <img src={item.image} className="rounded-2xl mb-4" />
        <h3 className="text-xl font-bold text-autumn-800 mb-2">
          {item.title}
        </h3>
        <p className="text-autumn-600">
          {item.description}
        </p>
      </Card>
    </motion.div>
  ))}
</div>
```

### CTA Section con Gradiente

```jsx
<section className="relative py-24 overflow-hidden">
  {/* Fondo con gradiente */}
  <div className="absolute inset-0 bg-gradient-to-br from-autumn-500 via-rust-500 to-terracotta-600" />
  <div className="absolute inset-0 bg-mesh opacity-30" />

  {/* Contenido */}
  <div className="relative container mx-auto px-4 text-center">
    <h2 className="text-5xl font-bold text-white mb-6">
      ¿Listo para comenzar?
    </h2>
    <p className="text-xl text-white/90 mb-8">
      Descripción de la CTA
    </p>
    <Button variant="secondary">
      Tomar Acción
    </Button>
  </div>
</section>
```

---

## 💡 Tips de Diseño

### 1. Espaciado Consistente

```jsx
// Usa múltiplos de 4
className="p-4 mb-8 gap-6"  // 16px, 32px, 24px
```

### 2. Border Radius Generoso

```jsx
// Para modernidad, usa rounded grandes
className="rounded-2xl"  // 16px
className="rounded-3xl"  // 24px
className="rounded-4xl"  // 32px
```

### 3. Sombras Suaves

```jsx
className="shadow-soft"     // Sombra suave
className="shadow-soft-lg"  // Sombra suave grande
className="shadow-glass"    // Sombra para glassmorphism
```

### 4. Transiciones Suaves

```jsx
className="transition-all duration-300"
className="transition-colors duration-500"
```

### 5. Estados Hover

```jsx
<div className="
  bg-white
  hover:bg-autumn-50
  hover:shadow-soft-lg
  hover:-translate-y-1
  transition-all
  duration-300
">
  Interactivo
</div>
```

---

## 🎨 Inspiración de Diseño

El diseño de Creaparty está inspirado en:

- **Glassmorphism**: Apple iOS, Windows 11
- **Neumorphism**: Diseños soft UI
- **Gradientes**: Stripe, Linear, Vercel
- **Animaciones**: Framer, Apple
- **Formas orgánicas**: Spotify, Slack

---

## 📚 Recursos

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Glassmorphism Generator](https://ui.glass/generator/)
- [Gradient Generator](https://cssgradient.io/)

---

**Experimenta, innova y crea diseños únicos con Creaparty!**

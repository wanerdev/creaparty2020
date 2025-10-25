import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Calendar, Users, Mail, Phone, MessageSquare, Plus, Minus, Trash2, Package, ShoppingCart, ArrowLeft, Check } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { sendNewQuotationEmail } from '../../services/emailService';
import { useCart } from '../../context/CartContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';

const quotationSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(8, 'Teléfono inválido'),
  fecha_evento: z.string().min(1, 'Selecciona una fecha'),
  tipo_evento: z.string().min(1, 'Selecciona el tipo de evento'),
  tipo_servicio: z.string().min(1, 'Selecciona el tipo de servicio'),
  num_personas: z.string().min(1, 'Indica el número de personas'),
  mensaje: z.string().optional(),
});

const Quotation = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState('alquiler');
  const navigate = useNavigate();

  const {
    cartItems,
    selectedDate,
    setSelectedDate,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
  } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      tipo_servicio: 'alquiler',
    },
  });

  // Si hay una fecha guardada en el carrito, establecerla en el formulario
  useEffect(() => {
    if (selectedDate) {
      setValue('fecha_evento', selectedDate);
    }
  }, [selectedDate, setValue]);

  // Cuando cambia la fecha del formulario, actualizar el carrito
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    checkStockAvailability(newDate);
  };

  const checkStockAvailability = async (fecha) => {
    if (!fecha || cartItems.length === 0) return;

    try {
      // Para cada producto en el carrito, verificar stock disponible
      for (const item of cartItems) {
        try {
          const { data, error } = await supabase.rpc('get_stock_disponible', {
            p_producto_id: item.id,
            p_fecha: fecha,
          });

          if (!error && data !== null) {
            // Actualizar stock disponible si es necesario
            console.log(`Stock disponible para ${item.nombre}:`, data);
          }
        } catch (err) {
          // Si la función no existe, continuar sin error
          console.warn('Stock check skipped for:', item.nombre);
        }
      }
    } catch (error) {
      console.error('Error checking stock availability:', error);
    }
  };

  const onSubmit = async (data) => {
    // Prevenir múltiples envíos
    if (loading) {
      console.log('Ya se está procesando una cotización');
      return;
    }

    setLoading(true);
    try {
      const total = getTotal();

      // 1. Crear cotización
      const { data: cotizacion, error: cotizacionError } = await supabase
        .from('cotizaciones')
        .insert([
          {
            ...data,
            estado: 'pendiente',
            num_personas: parseInt(data.num_personas),
            tipo_servicio: data.tipo_servicio,
            total: total,
          },
        ])
        .select()
        .single();

      if (cotizacionError) throw cotizacionError;

      // 2. Guardar productos de la cotización
      if (cartItems.length > 0) {
        const productosData = cartItems.map((item) => ({
          cotizacion_id: cotizacion.id,
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.precio * item.cantidad,
        }));

        const { error: productosError } = await supabase
          .from('productos_cotizacion')
          .insert(productosData);

        if (productosError) throw productosError;
      }

      // 3. Send email notification
      try {
        await sendNewQuotationEmail({
          ...data,
          productos: cartItems,
          total: total,
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Continue even if email fails
      }

      // Mantener loading=true para prevenir doble envío hasta que se cambie la vista
      setSubmitted(true);
      reset();
      clearCart();
      // NO setear loading a false aquí - la vista cambia de todos modos
    } catch (error) {
      console.error('Error submitting quotation:', error);
      alert('Hubo un error al enviar tu cotización. Por favor intenta de nuevo.');
      setLoading(false); // Solo resetear loading en caso de error
    }
  };

  const eventTypes = [
    'Boda',
    'Cumpleaños',
    'Evento Corporativo',
    'Graduación',
    'Baby Shower',
    'Otro',
  ];

  if (submitted) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl animate-fade-in">
          <Card className="text-center p-12">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 animate-scale-in">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-3xl font-bold gradient-text mb-4">
              ¡Cotización Enviada!
            </h2>
            <p className="text-autumn-600 text-lg mb-8">
              Hemos recibido tu solicitud. Te contactaremos pronto con una cotización personalizada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                onClick={() => setSubmitted(false)}
              >
                Enviar Otra Cotización
              </Button>
              <Button
                variant="secondary"
                onClick={() => (window.location.href = '/')}
              >
                Volver al Inicio
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-header">Solicitar Cotización</h1>
          <p className="section-subheader">
            Completa el formulario y te enviaremos una cotización personalizada
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-xl font-bold text-autumn-800 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Información Personal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nombre Completo"
                      {...register('nombre')}
                      error={errors.nombre?.message}
                      placeholder="Juan Pérez"
                    />
                    <Input
                      label="Teléfono"
                      type="tel"
                      {...register('telefono')}
                      error={errors.telefono?.message}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="mt-6">
                    <Input
                      label="Email"
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                </div>

                {/* Event Info */}
                <div>
                  <h3 className="text-xl font-bold text-autumn-800 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Detalles del Evento
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-autumn-700 mb-2">
                        Tipo de Evento
                      </label>
                      <select
                        {...register('tipo_evento')}
                        className="input-modern"
                      >
                        <option value="">Seleccionar...</option>
                        {eventTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.tipo_evento && (
                        <p className="text-sm text-red-500 mt-2">
                          {errors.tipo_evento.message}
                        </p>
                      )}
                    </div>

                    <Input
                      label="Fecha del Evento"
                      type="date"
                      {...register('fecha_evento')}
                      onChange={handleDateChange}
                      error={errors.fecha_evento?.message}
                    />
                  </div>

                  <div className="mt-6">
                    <Input
                      label="Número de Personas"
                      type="number"
                      {...register('num_personas')}
                      error={errors.num_personas?.message}
                      placeholder="50"
                      min="1"
                    />
                  </div>
                </div>

                {/* Service Type Selection */}
                <div>
                  <h3 className="text-xl font-bold text-autumn-800 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Tipo de Servicio
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Alquiler Simple */}
                    <label
                      className={`relative flex flex-col p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                        selectedServiceType === 'alquiler'
                          ? 'border-autumn-500 bg-autumn-50 shadow-soft-lg'
                          : 'border-autumn-200 hover:border-autumn-300 hover:bg-autumn-50/50'
                      }`}
                    >
                      <input
                        type="radio"
                        value="alquiler"
                        {...register('tipo_servicio')}
                        onChange={(e) => setSelectedServiceType(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">🪑</span>
                        {selectedServiceType === 'alquiler' && (
                          <div className="w-6 h-6 bg-autumn-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-autumn-800 mb-2">
                        Solo Alquiler
                      </h4>
                      <p className="text-sm text-autumn-600">
                        Renta el mobiliario y tú te encargas de la instalación y decoración
                      </p>
                    </label>

                    {/* Servicio con Decoración */}
                    <label
                      className={`relative flex flex-col p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                        selectedServiceType === 'decoracion'
                          ? 'border-autumn-500 bg-autumn-50 shadow-soft-lg'
                          : 'border-autumn-200 hover:border-autumn-300 hover:bg-autumn-50/50'
                      }`}
                    >
                      <input
                        type="radio"
                        value="decoracion"
                        {...register('tipo_servicio')}
                        onChange={(e) => setSelectedServiceType(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">✨</span>
                        {selectedServiceType === 'decoracion' && (
                          <div className="w-6 h-6 bg-autumn-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-autumn-800 mb-2">
                        Servicio de Decoración
                      </h4>
                      <p className="text-sm text-autumn-600">
                        Incluye mobiliario + instalación + decoración profesional de tu evento
                      </p>
                      <div className="mt-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full inline-block">
                        Servicio completo
                      </div>
                    </label>
                  </div>

                  {errors.tipo_servicio && (
                    <p className="text-sm text-red-500 mt-2">
                      {errors.tipo_servicio.message}
                    </p>
                  )}
                </div>

                {/* Cart Review */}
                {cartItems.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-autumn-800 mb-4 flex items-center justify-between">
                      <span className="flex items-center">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Productos Seleccionados
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate('/catalogo')}
                        className="text-sm text-autumn-600 hover:text-autumn-800 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar más productos
                      </button>
                    </h3>

                    <Card className="p-4 bg-autumn-50 border-2 border-autumn-200">
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                            <div className="flex-1">
                              <p className="font-medium text-autumn-800">{item.nombre}</p>
                              <p className="text-sm text-autumn-600">
                                ${item.precio} x {item.cantidad} = ${(item.precio * item.cantidad).toFixed(2)}
                              </p>
                              {item.stockDisponible !== undefined && item.stockDisponible < item.stock && (
                                <p className="text-xs text-amber-600 mt-1">
                                  {item.stockDisponible} disponibles para esta fecha
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                                className="p-1 hover:bg-autumn-100 rounded transition-colors"
                              >
                                <Minus className="w-4 h-4 text-autumn-600" />
                              </button>
                              <span className="w-8 text-center font-semibold">{item.cantidad}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                                className="p-1 hover:bg-autumn-100 rounded transition-colors"
                              >
                                <Plus className="w-4 h-4 text-autumn-600" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="p-1 hover:bg-red-100 rounded transition-colors ml-2"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-autumn-200">
                        <div className="flex items-center justify-between text-lg font-bold">
                          <span className="text-autumn-800">Total Estimado:</span>
                          <span className="gradient-text">${getTotal().toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-autumn-500 mt-1">
                          Este es un precio estimado. Recibirás la cotización final por email.
                        </p>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Empty Cart Message */}
                {cartItems.length === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                    <Package className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <p className="text-blue-800 font-semibold mb-2">
                      No has seleccionado productos
                    </p>
                    <p className="text-sm text-blue-600 mb-4">
                      Puedes agregar mobiliario desde nuestro catálogo o continuar sin productos
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate('/catalogo')}
                    >
                      Ir al Catálogo
                    </Button>
                  </div>
                )}

                {/* Message */}
                <div>
                  <h3 className="text-xl font-bold text-autumn-800 mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Detalles Adicionales
                  </h3>
                  <Textarea
                    label="Mensaje (Opcional)"
                    {...register('mensaje')}
                    placeholder="Cuéntanos más sobre tu evento, tus necesidades específicas, preferencias de estilo, etc."
                    rows={6}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando cotización...
                    </span>
                  ) : (
                    'Enviar Cotización'
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-autumn-500 to-rust-500 text-white">
              <h3 className="text-2xl font-bold mb-4">¿Qué sigue?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold">Revisamos tu solicitud</p>
                    <p className="text-sm text-white/80">
                      Analizamos los detalles de tu evento
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">Creamos tu cotización</p>
                    <p className="text-sm text-white/80">
                      Preparamos una propuesta personalizada
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">Te contactamos</p>
                    <p className="text-sm text-white/80">
                      Recibirás nuestra respuesta en 24-48 horas
                    </p>
                  </div>
                </li>
              </ul>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-autumn-800 mb-4">
                Contacto Directo
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-autumn-500 mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-autumn-800">Teléfono</p>
                    <p className="text-autumn-600">+1 (829) 569-0758</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-autumn-500 mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-autumn-800">Email</p>
                    <p className="text-autumn-600">alcequiezyuleidy25@gmail.com</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotation;

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Calendar, Users, Mail, Phone, MessageSquare } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { sendNewQuotationEmail } from '../../services/emailService';
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
  num_personas: z.string().min(1, 'Indica el número de personas'),
  mensaje: z.string().optional(),
});

const Quotation = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(quotationSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('cotizaciones').insert([
        {
          ...data,
          estado: 'pendiente',
          num_personas: parseInt(data.num_personas),
        },
      ]);

      if (error) throw error;

      // Send email notification
      try {
        await sendNewQuotationEmail(data);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Continue even if email fails
      }

      setSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting quotation:', error);
      alert('Hubo un error al enviar tu cotización. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
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
            Cuéntanos sobre tu evento y te enviaremos una cotización personalizada
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
                  {loading ? 'Enviando...' : 'Enviar Cotización'}
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

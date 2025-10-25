import { useState, useEffect } from 'react';
import { Search, Eye, Check, X, Mail, Calendar, Users, Phone } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { sendQuotationApprovedEmail, sendQuotationRejectedEmail } from '../../services/emailService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { formatDate } from '../../lib/utils';

const QuotationsManagement = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pendiente, aprobada, rechazada
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const { data, error } = await supabase
        .from('cotizaciones')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotations(data || []);
    } catch (error) {
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (quotation) => {
    if (!confirm('¿Aprobar esta cotización?')) return;

    try {
      // Actualizar estado en BD
      const { error } = await supabase
        .from('cotizaciones')
        .update({ estado: 'aprobada' })
        .eq('id', quotation.id);

      if (error) throw error;

      // Enviar email
      try {
        await sendQuotationApprovedEmail({
          nombre: quotation.nombre,
          email: quotation.email,
          tipo_evento: quotation.tipo_evento,
          fecha_evento: quotation.fecha_evento,
          num_personas: quotation.num_personas,
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }

      alert('Cotización aprobada y email enviado');
      fetchQuotations();
      setSelectedQuotation(null);
    } catch (error) {
      console.error('Error approving quotation:', error);
      alert('Error al aprobar la cotización');
    }
  };

  const handleReject = async (quotation) => {
    const motivo = prompt('Motivo del rechazo (opcional):');
    if (motivo === null) return; // Cancelado

    try {
      // Actualizar estado
      const { error } = await supabase
        .from('cotizaciones')
        .update({ estado: 'rechazada' })
        .eq('id', quotation.id);

      if (error) throw error;

      // Enviar email
      try {
        await sendQuotationRejectedEmail({
          nombre: quotation.nombre,
          email: quotation.email,
          tipo_evento: quotation.tipo_evento,
          motivo: motivo || undefined,
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }

      alert('Cotización rechazada y email enviado');
      fetchQuotations();
      setSelectedQuotation(null);
    } catch (error) {
      console.error('Error rejecting quotation:', error);
      alert('Error al rechazar la cotización');
    }
  };

  const handleConvertToReservation = async (quotation) => {
    if (!confirm('¿Convertir esta cotización en una reserva?')) return;

    try {
      // Crear reserva
      const { error: reservationError } = await supabase
        .from('reservas')
        .insert([
          {
            cotizacion_id: quotation.id,
            nombre_cliente: quotation.nombre,
            email_cliente: quotation.email,
            telefono_cliente: quotation.telefono,
            fecha_evento: quotation.fecha_evento,
            tipo_evento: quotation.tipo_evento,
            num_personas: quotation.num_personas,
            estado: 'confirmada',
          },
        ]);

      if (reservationError) throw reservationError;

      // Actualizar cotización
      const { error: quotationError } = await supabase
        .from('cotizaciones')
        .update({ estado: 'aprobada' })
        .eq('id', quotation.id);

      if (quotationError) throw quotationError;

      alert('Reserva creada exitosamente');
      fetchQuotations();
      setSelectedQuotation(null);
    } catch (error) {
      console.error('Error converting to reservation:', error);
      alert('Error al crear la reserva');
    }
  };

  const filteredQuotations = quotations.filter((q) => {
    const matchesFilter = filter === 'all' || q.estado === filter;
    const matchesSearch =
      q.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700';
      case 'aprobada':
        return 'bg-green-100 text-green-700';
      case 'rechazada':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold gradient-text">Gestión de Cotizaciones</h2>
        <p className="text-autumn-600 mt-2">Administra las solicitudes de cotización</p>
      </div>

      {/* Filtros */}
      <Card className="mb-8 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-autumn-400" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          {/* Filtro de estado */}
          <div className="flex gap-2">
            {['all', 'pendiente', 'aprobada', 'rechazada'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === status
                    ? 'bg-gradient-to-r from-autumn-500 to-rust-500 text-white'
                    : 'bg-white text-autumn-700 hover:bg-autumn-50'
                }`}
              >
                {status === 'all' ? 'Todas' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Lista de Cotizaciones */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-16 h-16 border-4 border-autumn-200 border-t-autumn-500 rounded-full animate-spin" />
        </div>
      ) : filteredQuotations.length === 0 ? (
        <Card className="text-center py-20">
          <p className="text-autumn-600">No hay cotizaciones con estos filtros</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQuotations.map((quotation) => (
            <div key={quotation.id}>
              <Card className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Información Principal */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-autumn-800">
                          {quotation.nombre}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-autumn-600">
                          <Mail className="w-4 h-4" />
                          {quotation.email}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-autumn-600">
                          <Phone className="w-4 h-4" />
                          {quotation.telefono}
                        </div>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                          quotation.estado
                        )}`}
                      >
                        {quotation.estado.charAt(0).toUpperCase() + quotation.estado.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-autumn-500">Tipo de Evento</div>
                        <div className="font-semibold text-autumn-800">
                          {quotation.tipo_evento}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-autumn-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Fecha del Evento
                        </div>
                        <div className="font-semibold text-autumn-800">
                          {formatDate(quotation.fecha_evento)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-autumn-500 flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Personas
                        </div>
                        <div className="font-semibold text-autumn-800">
                          {quotation.num_personas}
                        </div>
                      </div>
                    </div>

                    {quotation.mensaje && (
                      <div className="p-4 bg-autumn-50 rounded-xl">
                        <div className="text-sm text-autumn-500 mb-1">Mensaje:</div>
                        <div className="text-autumn-700">{quotation.mensaje}</div>
                      </div>
                    )}

                    <div className="text-xs text-autumn-400 mt-4">
                      Recibida: {formatDate(quotation.created_at)}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    {quotation.estado === 'pendiente' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(quotation)}
                          className="w-full"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Aprobar
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleConvertToReservation(quotation)}
                          className="w-full"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Crear Reserva
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(quotation)}
                          className="w-full text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Rechazar
                        </Button>
                      </>
                    )}

                    {quotation.estado === 'aprobada' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleConvertToReservation(quotation)}
                        className="w-full"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Crear Reserva
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuotationsManagement;

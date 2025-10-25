import { useState, useEffect } from 'react';
import { Search, Calendar, Mail, Phone, Users, Edit, X, Package, DollarSign, ShoppingCart } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { sendReservationConfirmedEmail } from '../../services/emailService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { formatDate } from '../../lib/utils';

const ReservationsManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pendiente, confirmada, completada, cancelada
  const [searchQuery, setSearchQuery] = useState('');
  const [reservationProducts, setReservationProducts] = useState({});

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .order('fecha_evento', { ascending: true });

      if (error) throw error;
      setReservations(data || []);

      // Fetch products for each reservation
      if (data && data.length > 0) {
        await fetchReservationProducts(data);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservationProducts = async (reservations) => {
    try {
      const productsMap = {};

      await Promise.all(
        reservations.map(async (reservation) => {
          const { data, error } = await supabase
            .from('productos_reserva')
            .select(`
              *,
              productos:producto_id (
                nombre,
                precio,
                imagen_url
              )
            `)
            .eq('reserva_id', reservation.id);

          if (!error && data) {
            productsMap[reservation.id] = data;
          } else {
            productsMap[reservation.id] = [];
          }
        })
      );

      setReservationProducts(productsMap);
    } catch (error) {
      console.error('Error fetching reservation products:', error);
    }
  };

  const handleChangeStatus = async (reservationId, newStatus) => {
    try {
      const { data: reservation, error: fetchError } = await supabase
        .from('reservas')
        .select('*')
        .eq('id', reservationId)
        .single();

      if (fetchError) throw fetchError;

      // Actualizar estado
      const { error } = await supabase
        .from('reservas')
        .update({ estado: newStatus })
        .eq('id', reservationId);

      if (error) throw error;

      // Si se confirma, enviar email
      if (newStatus === 'confirmada') {
        try {
          await sendReservationConfirmedEmail({
            nombre: reservation.nombre_cliente,
            email: reservation.email_cliente,
            tipo_evento: reservation.tipo_evento,
            fecha_evento: reservation.fecha_evento,
            num_personas: reservation.num_personas,
          });
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      }

      alert(`Reserva actualizada a: ${newStatus}`);
      fetchReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Error al actualizar la reserva');
    }
  };

  const filteredReservations = reservations.filter((r) => {
    const matchesFilter = filter === 'all' || r.estado === filter;
    const matchesSearch =
      r.nombre_cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email_cliente.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmada':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completada':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelada':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const isEventPast = (fecha) => {
    return new Date(fecha) < new Date();
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold gradient-text">Gestión de Reservas</h2>
        <p className="text-autumn-600 mt-2">Administra todas las reservas de eventos</p>
      </div>

      {/* Filtros */}
      <Card className="mb-8 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-autumn-400" />
            <Input
              placeholder="Buscar por cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          {/* Filtro de estado */}
          <div className="flex flex-wrap gap-2">
            {['all', 'pendiente', 'confirmada', 'completada', 'cancelada'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                  filter === status
                    ? 'bg-gradient-to-r from-autumn-500 to-rust-500 text-white'
                    : 'bg-white text-autumn-700 hover:bg-autumn-50'
                }`}
              >
                {status === 'all'
                  ? 'Todas'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Lista de Reservas */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-16 h-16 border-4 border-autumn-200 border-t-autumn-500 rounded-full animate-spin" />
        </div>
      ) : filteredReservations.length === 0 ? (
        <Card className="text-center py-20">
          <p className="text-autumn-600">No hay reservas con estos filtros</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <div key={reservation.id}>
              <Card
                className={`p-6 border-2 ${
                  isEventPast(reservation.fecha_evento) &&
                  reservation.estado !== 'completada' &&
                  reservation.estado !== 'cancelada'
                    ? 'border-orange-300 bg-orange-50/30'
                    : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Info Principal */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-autumn-800">
                          {reservation.nombre_cliente}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-autumn-600">
                          <Mail className="w-4 h-4" />
                          {reservation.email_cliente}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-autumn-600">
                          <Phone className="w-4 h-4" />
                          {reservation.telefono_cliente}
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                            reservation.estado
                          )}`}
                        >
                          {reservation.estado.charAt(0).toUpperCase() +
                            reservation.estado.slice(1)}
                        </span>
                        {isEventPast(reservation.fecha_evento) &&
                          reservation.estado !== 'completada' &&
                          reservation.estado !== 'cancelada' && (
                            <div className="text-orange-600 text-xs mt-1 font-semibold">
                              ⚠️ Evento pasado
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-autumn-500">Tipo de Evento</div>
                        <div className="font-semibold text-autumn-800">
                          {reservation.tipo_evento}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-autumn-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Fecha del Evento
                        </div>
                        <div className="font-semibold text-autumn-800">
                          {formatDate(reservation.fecha_evento)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-autumn-500 flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Personas
                        </div>
                        <div className="font-semibold text-autumn-800">
                          {reservation.num_personas}
                        </div>
                      </div>
                    </div>

                    {reservation.notas && (
                      <div className="p-4 bg-autumn-50 rounded-xl">
                        <div className="text-sm text-autumn-500 mb-1">Notas:</div>
                        <div className="text-autumn-700">{reservation.notas}</div>
                      </div>
                    )}

                    {/* Service Type Badge */}
                    {reservation.tipo_servicio && (
                      <div className="mt-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          reservation.tipo_servicio === 'decoracion'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {reservation.tipo_servicio === 'decoracion' ? '✨ Servicio de Decoración' : '🪑 Solo Alquiler'}
                        </span>
                      </div>
                    )}

                    {/* Products List */}
                    {reservationProducts[reservation.id] && reservationProducts[reservation.id].length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-autumn-700 mb-3">
                          <ShoppingCart className="w-4 h-4" />
                          Productos Reservados ({reservationProducts[reservation.id].length})
                        </div>
                        <div className="space-y-2">
                          {reservationProducts[reservation.id].map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-autumn-200"
                            >
                              {/* Product Image */}
                              {item.productos?.imagen_url && (
                                <img
                                  src={item.productos.imagen_url}
                                  alt={item.productos?.nombre}
                                  className="w-12 h-12 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/48?text=Sin+Imagen';
                                  }}
                                />
                              )}

                              {/* Product Info */}
                              <div className="flex-1">
                                <div className="font-semibold text-autumn-800 text-sm">
                                  {item.productos?.nombre}
                                </div>
                                <div className="text-xs text-autumn-600">
                                  <Package className="w-3 h-3 inline mr-1" />
                                  Cantidad: {item.cantidad} × ${item.precio_unitario}
                                </div>
                              </div>

                              {/* Subtotal */}
                              <div className="text-right">
                                <div className="text-sm font-bold text-autumn-700">
                                  ${item.subtotal}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Total */}
                        {reservation.total && (
                          <div className="mt-3 p-3 bg-gradient-to-r from-autumn-50 to-rust-50 rounded-xl border border-autumn-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-autumn-700 flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                Total de la Reserva
                              </span>
                              <span className="text-lg font-bold gradient-text">
                                ${reservation.total}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-autumn-400 mt-4">
                      Creada: {formatDate(reservation.created_at)}
                    </div>
                  </div>

                  {/* Cambiar Estado */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    <div className="text-sm font-medium text-autumn-700 mb-2">
                      Cambiar Estado:
                    </div>

                    {reservation.estado !== 'confirmada' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          handleChangeStatus(reservation.id, 'confirmada')
                        }
                        className="w-full"
                      >
                        Confirmar
                      </Button>
                    )}

                    {reservation.estado !== 'completada' &&
                      reservation.estado !== 'cancelada' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            handleChangeStatus(reservation.id, 'completada')
                          }
                          className="w-full"
                        >
                          Completar
                        </Button>
                      )}

                    {reservation.estado !== 'cancelada' &&
                      reservation.estado !== 'completada' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleChangeStatus(reservation.id, 'cancelada')
                          }
                          className="w-full text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
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

export default ReservationsManagement;

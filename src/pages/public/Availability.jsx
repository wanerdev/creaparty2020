import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { supabase } from '../../config/supabase';
import Card from '../../components/ui/Card';

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Availability = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .in('estado', ['confirmada', 'pendiente']);

      if (error) throw error;

      const formattedEvents = (data || []).map((reservation) => ({
        id: reservation.id,
        title: 'Reservado',
        start: new Date(reservation.fecha_evento),
        end: new Date(reservation.fecha_evento),
        allDay: true,
        resource: reservation,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: '#c97d56',
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
      },
    };
  };

  const isDateAvailable = (date) => {
    if (!date) return null;

    const dateString = format(date, 'yyyy-MM-dd');
    const isReserved = events.some((event) => {
      const eventDate = format(event.start, 'yyyy-MM-dd');
      return eventDate === dateString;
    });

    return !isReserved;
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-header">Disponibilidad</h1>
          <p className="section-subheader">
            Consulta las fechas disponibles para tu evento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block w-16 h-16 border-4 border-autumn-200 border-t-autumn-500 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="calendar-container">
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    eventPropGetter={eventStyleGetter}
                    culture="es"
                    messages={{
                      next: 'Siguiente',
                      previous: 'Anterior',
                      today: 'Hoy',
                      month: 'Mes',
                      week: 'Semana',
                      day: 'Día',
                      agenda: 'Agenda',
                      date: 'Fecha',
                      time: 'Hora',
                      event: 'Evento',
                      noEventsInRange: 'No hay eventos en este rango',
                    }}
                    onSelectSlot={handleSelectSlot}
                    selectable
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Legend & Info */}
          <div className="space-y-6">
            {/* Legend */}
            <Card>
              <h3 className="text-xl font-bold text-autumn-800 mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Leyenda
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-autumn-500 mr-3" />
                  <span className="text-autumn-700">Fecha Reservada</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-white border-2 border-autumn-200 mr-3" />
                  <span className="text-autumn-700">Fecha Disponible</span>
                </div>
              </div>
            </Card>

            {/* Selected Date Info */}
            {selectedDate && (
              <Card className="border-2 border-autumn-300">
                <h3 className="text-lg font-bold text-autumn-800 mb-4">
                  Fecha Seleccionada
                </h3>
                <div className="space-y-4">
                  <div className="text-2xl font-bold gradient-text">
                    {format(selectedDate, 'dd MMMM yyyy', { locale: es })}
                  </div>

                  {isDateAvailable(selectedDate) ? (
                    <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-900">
                          Fecha Disponible
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                          Esta fecha está libre para tu evento
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-xl">
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-900">
                          Fecha No Disponible
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                          Esta fecha ya está reservada
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* CTA */}
            <Card className="bg-gradient-to-br from-autumn-500 to-rust-500 text-white">
              <h3 className="text-xl font-bold mb-3">
                ¿Encontraste tu fecha ideal?
              </h3>
              <p className="text-white/90 mb-4 text-sm">
                Solicita una cotización y asegura tu fecha ahora
              </p>
              <a
                href="/cotizacion"
                className="block w-full px-6 py-3 bg-white text-autumn-700 font-semibold rounded-xl text-center hover:bg-cream-50 transition-colors"
              >
                Solicitar Cotización
              </a>
            </Card>
          </div>
        </div>

        {/* Custom Styles for Calendar */}
        <style>{`
          .calendar-container .rbc-calendar {
            font-family: 'Inter', sans-serif;
          }
          .rbc-header {
            padding: 1rem 0.5rem;
            font-weight: 600;
            color: #974e33;
            background: linear-gradient(to bottom, #f8ede7, #f0d6c8);
            border: none !important;
          }
          .rbc-today {
            background-color: #fdf5f1;
          }
          .rbc-off-range-bg {
            background-color: #fdfcfa;
          }
          .rbc-toolbar button {
            color: #974e33;
            border: 2px solid #e7bca8;
            border-radius: 0.75rem;
            padding: 0.5rem 1rem;
            font-weight: 600;
            transition: all 0.3s;
          }
          .rbc-toolbar button:hover {
            background-color: #f0d6c8;
            border-color: #c97d56;
          }
          .rbc-toolbar button.rbc-active {
            background: linear-gradient(to right, #c97d56, #e8673f);
            color: white;
            border-color: transparent;
          }
          .rbc-month-view {
            border: 2px solid #e7bca8;
            border-radius: 1rem;
            overflow: hidden;
          }
          .rbc-date-cell {
            padding: 0.5rem;
          }
          .rbc-event {
            background-color: #c97d56;
            border-radius: 0.5rem;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Availability;

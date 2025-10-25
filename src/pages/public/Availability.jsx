import { useState, useEffect, useRef } from 'react';
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
  const selectedDateRef = useRef(null);

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

      // Solo mostrar en el calendario las reservas con servicio de decoración
      // Los alquileres simples no bloquean la fecha
      const formattedEvents = (data || [])
        .filter(reservation => reservation.tipo_servicio === 'decoracion')
        .map((reservation) => ({
          id: reservation.id,
          title: 'Reservado - Servicio de Decoración',
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

  const scrollToSelectedDate = () => {
    // Wait for the component to render, then scroll
    setTimeout(() => {
      if (selectedDateRef.current && window.innerWidth < 1024) {
        selectedDateRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }, 100);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    scrollToSelectedDate();
  };

  const handleSelectEvent = (event) => {
    setSelectedDate(event.start);
    scrollToSelectedDate();
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-header">Disponibilidad</h1>
          <p className="section-subheader">
            Consulta las fechas con servicio de decoración reservado
          </p>
          <div className="mt-4 max-w-2xl mx-auto">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>🪑 Alquileres:</strong> Puedes alquilar mobiliario cualquier día (sujeto a stock disponible)
                <br />
                <strong>✨ Servicio de Decoración:</strong> Solo fechas marcadas como disponibles en el calendario
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-4 md:p-8">
              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block w-16 h-16 border-4 border-autumn-200 border-t-autumn-500 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="calendar-container overflow-x-auto">
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, minWidth: '100%' }}
                    eventPropGetter={eventStyleGetter}
                    culture="es"
                    views={['month']}
                    defaultView="month"
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
                    onSelectEvent={handleSelectEvent}
                    selectable
                    popup
                    step={60}
                    showMultiDayTimes
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
                  <span className="text-autumn-700 text-sm">Servicio de Decoración Reservado</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-white border-2 border-autumn-200 mr-3" />
                  <span className="text-autumn-700 text-sm">Disponible para Alquiler o Decoración</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-xl space-y-2">
                <p className="text-xs text-blue-800">
                  <strong>💡 Nota:</strong> Solo mostramos fechas con servicio de decoración. Los alquileres simples no bloquean fechas.
                </p>
                <p className="text-xs text-green-800 bg-green-50 p-2 rounded-lg">
                  <strong>📞 ¿Fecha ocupada?</strong> No te preocupes, solicita tu cotización de todos modos. Dependiendo de los horarios y ubicaciones, podemos organizarnos para atender múltiples eventos el mismo día.
                </p>
              </div>
            </Card>

            {/* Selected Date Info */}
            {selectedDate && (
              <Card ref={selectedDateRef} className="border-2 border-autumn-300">
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
                          ✅ Fecha Disponible
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                          Puedes solicitar <strong>alquiler de mobiliario</strong> o <strong>servicio de decoración</strong> para esta fecha.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-xl">
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-900">
                          ⚠️ Servicio de Decoración No Disponible
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                          Ya hay un servicio de decoración reservado para esta fecha. Puedes solicitar <strong>solo alquiler de mobiliario</strong> (sujeto a disponibilidad de stock).
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
            padding: 0.75rem 0.25rem;
            font-weight: 600;
            color: #974e33;
            background: linear-gradient(to bottom, #f8ede7, #f0d6c8);
            border: none !important;
            font-size: 0.75rem;
          }
          .rbc-today {
            background-color: #fdf5f1;
          }
          .rbc-off-range-bg {
            background-color: #fdfcfa;
          }
          .rbc-toolbar {
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }
          .rbc-toolbar button {
            color: #974e33;
            border: 2px solid #e7bca8;
            border-radius: 0.5rem;
            padding: 0.4rem 0.75rem;
            font-weight: 600;
            transition: all 0.3s;
            font-size: 0.875rem;
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
          .rbc-toolbar-label {
            font-size: 1rem;
            font-weight: 700;
          }
          .rbc-month-view {
            border: 2px solid #e7bca8;
            border-radius: 1rem;
            overflow: hidden;
          }
          .rbc-date-cell {
            padding: 0.25rem;
            font-size: 0.875rem;
          }
          .rbc-event {
            background-color: #c97d56;
            border-radius: 0.5rem;
            font-size: 0.75rem;
            padding: 2px 4px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .rbc-event:hover {
            background-color: #974e33;
            transform: scale(1.05);
          }
          .rbc-day-bg {
            min-height: 40px;
            cursor: pointer;
          }
          .rbc-day-bg:hover {
            background-color: #fdf5f1;
          }
          .rbc-date-cell {
            pointer-events: auto;
          }
          .rbc-month-view .rbc-day-bg {
            pointer-events: auto;
          }

          @media (max-width: 640px) {
            .rbc-header {
              padding: 0.5rem 0.125rem;
              font-size: 0.625rem;
            }
            .rbc-toolbar button {
              padding: 0.35rem 0.5rem;
              font-size: 0.75rem;
            }
            .rbc-toolbar-label {
              font-size: 0.875rem;
              width: 100%;
              text-align: center;
              margin-bottom: 0.5rem;
            }
            .rbc-date-cell {
              padding: 0.125rem;
              font-size: 0.75rem;
            }
            .rbc-event {
              font-size: 0.625rem;
              padding: 1px 2px;
            }
            .rbc-day-bg {
              min-height: 35px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Availability;

// Vercel Serverless Function para enviar emails con Resend
// Este archivo se deployará automáticamente en Vercel

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Solo permitir POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    let emailData;

    switch (type) {
      case 'new_quotation':
        // Email al admin cuando llega una nueva cotización
        emailData = {
          from: 'Creaparty <noreply@tudominio.com>', // Cambia esto a tu dominio verificado
          to: 'admin@creaparty.com', // Email del admin
          subject: '🎉 Nueva Cotización Recibida',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #c97d56;">Nueva Cotización</h2>
              <p>Has recibido una nueva solicitud de cotización:</p>

              <div style="background: #f8ede7; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p><strong>Cliente:</strong> ${data.nombre}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Teléfono:</strong> ${data.telefono}</p>
                <p><strong>Tipo de Evento:</strong> ${data.tipo_evento}</p>
                <p><strong>Fecha del Evento:</strong> ${data.fecha_evento}</p>
                <p><strong>Número de Personas:</strong> ${data.num_personas}</p>
                ${data.mensaje ? `<p><strong>Mensaje:</strong> ${data.mensaje}</p>` : ''}
              </div>

              <p>Accede al panel de administración para gestionar esta cotización.</p>

              <a href="https://tudominio.com/admin/cotizaciones"
                 style="display: inline-block; background: linear-gradient(to right, #c97d56, #e8673f);
                        color: white; padding: 12px 24px; text-decoration: none;
                        border-radius: 10px; margin-top: 20px;">
                Ver Cotizaciones
              </a>
            </div>
          `,
        };
        break;

      case 'quotation_approved':
        // Email al cliente cuando su cotización es aprobada
        emailData = {
          from: 'Creaparty <noreply@tudominio.com>',
          to: data.email,
          subject: '✅ Tu Cotización ha sido Aprobada',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #c97d56;">¡Buenas Noticias, ${data.nombre}!</h2>
              <p>Tu cotización para <strong>${data.tipo_evento}</strong> ha sido aprobada.</p>

              <div style="background: #f8ede7; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p><strong>Fecha del Evento:</strong> ${data.fecha_evento}</p>
                <p><strong>Número de Personas:</strong> ${data.num_personas}</p>
                ${data.notas ? `<p><strong>Notas:</strong> ${data.notas}</p>` : ''}
              </div>

              <p>Nos pondremos en contacto contigo pronto para finalizar los detalles.</p>

              <p>Si tienes alguna pregunta, no dudes en contactarnos:</p>
              <p>📧 info@creaparty.com</p>
              <p>📱 +1 (555) 123-4567</p>

              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Saludos,<br>
                El equipo de Creaparty
              </p>
            </div>
          `,
        };
        break;

      case 'quotation_rejected':
        // Email al cliente cuando su cotización es rechazada
        emailData = {
          from: 'Creaparty <noreply@tudominio.com>',
          to: data.email,
          subject: 'Sobre tu Cotización - Creaparty',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #c97d56;">Hola ${data.nombre},</h2>
              <p>Lamentablemente no podemos proceder con tu cotización para ${data.tipo_evento}.</p>

              ${data.motivo ? `<p><strong>Motivo:</strong> ${data.motivo}</p>` : ''}

              <p>Te invitamos a contactarnos para explorar otras opciones que puedan adaptarse mejor a tus necesidades.</p>

              <p>📧 info@creaparty.com</p>
              <p>📱 +1 (555) 123-4567</p>

              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Saludos,<br>
                El equipo de Creaparty
              </p>
            </div>
          `,
        };
        break;

      case 'reservation_confirmed':
        // Email al cliente cuando su reserva es confirmada
        emailData = {
          from: 'Creaparty <noreply@tudominio.com>',
          to: data.email,
          subject: '🎊 Reserva Confirmada - Creaparty',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #c97d56;">¡Reserva Confirmada!</h2>
              <p>Hola ${data.nombre},</p>
              <p>Tu reserva ha sido confirmada exitosamente.</p>

              <div style="background: #f8ede7; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #c97d56; margin-top: 0;">Detalles de la Reserva</h3>
                <p><strong>Tipo de Evento:</strong> ${data.tipo_evento}</p>
                <p><strong>Fecha:</strong> ${data.fecha_evento}</p>
                <p><strong>Número de Personas:</strong> ${data.num_personas}</p>
              </div>

              <p>Estamos emocionados de ser parte de tu evento especial.</p>
              <p>Nos pondremos en contacto contigo próximamente para coordinar los detalles finales.</p>

              <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>

              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Saludos,<br>
                El equipo de Creaparty
              </p>
            </div>
          `,
        };
        break;

      case 'event_reminder':
        // Email recordatorio 7 días antes del evento
        emailData = {
          from: 'Creaparty <noreply@tudominio.com>',
          to: data.email,
          subject: '⏰ Recordatorio: Tu Evento se Acerca',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #c97d56;">Recordatorio de Evento</h2>
              <p>Hola ${data.nombre},</p>
              <p>Te recordamos que tu evento está próximo a realizarse.</p>

              <div style="background: #f8ede7; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p><strong>Fecha:</strong> ${data.fecha_evento}</p>
                <p><strong>Tipo de Evento:</strong> ${data.tipo_evento}</p>
              </div>

              <p>Estamos preparando todo para que tu evento sea perfecto.</p>
              <p>Si necesitas hacer algún cambio de último momento, contáctanos lo antes posible.</p>

              <p>📧 info@creaparty.com</p>
              <p>📱 +1 (555) 123-4567</p>

              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Saludos,<br>
                El equipo de Creaparty
              </p>
            </div>
          `,
        };
        break;

      default:
        return res.status(400).json({ error: 'Invalid email type' });
    }

    // Enviar el email
    const result = await resend.emails.send(emailData);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
}

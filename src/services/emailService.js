// Servicio para enviar emails a través de la API de Vercel Serverless Function

const API_URL = import.meta.env.PROD
  ? '/api/send-email' // En producción usa la función serverless
  : 'http://localhost:5173/api/send-email'; // En desarrollo

export const sendEmail = async (type, data) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};

// Helper functions para cada tipo de email

export const sendNewQuotationEmail = async (quotationData) => {
  return sendEmail('new_quotation', quotationData);
};

export const sendQuotationApprovedEmail = async (quotationData) => {
  return sendEmail('quotation_approved', quotationData);
};

export const sendQuotationRejectedEmail = async (quotationData) => {
  return sendEmail('quotation_rejected', quotationData);
};

export const sendReservationConfirmedEmail = async (reservationData) => {
  return sendEmail('reservation_confirmed', reservationData);
};

export const sendEventReminderEmail = async (reservationData) => {
  return sendEmail('event_reminder', reservationData);
};

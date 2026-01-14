import emailjs from '@emailjs/browser';

// EmailJS Configuration
// Get your keys from https://dashboard.emailjs.com/
export const EMAILJS_CONFIG = {
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YVvnU5ulJ_2GW0rW4',
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_seli6gr',
  TEMPLATE_ID_ADMIN: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_ADMIN || 'template_yf6h4lf',
  TEMPLATE_ID_CLIENT: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CLIENT || 'template_k597rol',
};

// Initialize EmailJS
export const initializeEmailJS = () => {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
};

// Send order confirmation to admin
export const sendAdminOrderNotification = async (orderData: {
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  totalAmount: number;
  currency: string;
}) => {
  try {
    const templateParams = {
      to_email: 'danielminto13@gmail.com',
      order_number: orderData.orderNumber,
      client_name: orderData.clientName,
      client_email: orderData.clientEmail,
      package_type: orderData.packageType,
      total_amount: `${orderData.currency} ${orderData.totalAmount.toLocaleString()}`,
      message: `New order received from ${orderData.clientName}`,
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID_ADMIN,
      templateParams
    );

    return { success: true, response };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
};

// Send order confirmation to client
export const sendClientOrderConfirmation = async (orderData: {
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  totalAmount: number;
  currency: string;
}) => {
  try {
    const templateParams = {
      to_email: orderData.clientEmail,
      to_name: orderData.clientName,
      order_number: orderData.orderNumber,
      package_type: orderData.packageType,
      total_amount: `${orderData.currency} ${orderData.totalAmount.toLocaleString()}`,
      deposit_amount: `${orderData.currency} ${(orderData.totalAmount / 2).toLocaleString()}`,
      message: 'Thank you for your order! We have received your request and will begin processing it shortly.',
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID_CLIENT,
      templateParams
    );

    return { success: true, response };
  } catch (error) {
    console.error('Error sending client confirmation:', error);
    return { success: false, error };
  }
};

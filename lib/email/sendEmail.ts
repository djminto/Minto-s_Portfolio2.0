import nodemailer from 'nodemailer';

// Create Gmail transporter using App Password
// You need to generate an App Password from: https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL || 'danielminto13@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  templateType: 'contact' | 'order-confirmation' | 'admin-notification' | 'proposal-email',
  variables: Record<string, any>
) {
  try {
    console.log(`[sendEmail] Type: ${templateType}, To: ${to}`);

    // Build email HTML based on template type
    let htmlContent = '';

    if (templateType === 'contact') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; text-align: center; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; font-size: 28px;">New Contact Form Submission</h2>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
            <div style="margin-bottom: 20px;">
              <p style="margin: 10px 0;"><strong style="color: #333;">Name:</strong> ${variables.from_name || 'N/A'}</p>
              <p style="margin: 10px 0;"><strong style="color: #333;">Email:</strong> ${variables.reply_to || 'N/A'}</p>
              <p style="margin: 10px 0;"><strong style="color: #333;">Phone:</strong> ${variables.phone || 'N/A'}</p>
              <p style="margin: 10px 0;"><strong style="color: #333;">Subject:</strong> ${variables.subject || 'N/A'}</p>
            </div>
            <div style="background: white; padding: 15px; border-left: 4px solid #667eea; margin-top: 20px;">
              <p style="margin: 0 0 10px 0;"><strong style="color: #333;">Message:</strong></p>
              <p style="margin: 0; color: #555; line-height: 1.6;">${variables.message || 'N/A'}</p>
            </div>
          </div>
        </div>
      `;
    } else if (templateType === 'order-confirmation') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; text-align: center; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; font-size: 28px;">Order Confirmation</h2>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
            <p style="color: #555; font-size: 16px; margin-bottom: 20px;">Thank you for your order! We're excited to work on your project.</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="color: #666;"><strong>Order Number:</strong></span>
                <span style="color: #333; font-weight: bold;">${variables.orderNumber || 'N/A'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="color: #666;"><strong>Package:</strong></span>
                <span style="color: #333;">${variables.packageType || 'N/A'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                <span style="color: #666;"><strong>Amount:</strong></span>
                <span style="color: #667eea; font-weight: bold; font-size: 18px;">${variables.totalAmount || '0'} ${variables.currency || 'USD'}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (templateType === 'admin-notification') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; font-size: 28px;">📦 New Order Received</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Order ID: ${variables.orderNumber || 'N/A'}</p>
          </div>
          <div style="background: white; border: 1px solid #e0e0e0; border-top: none;">
            <div style="padding: 30px; background: #f9f9f9; border-bottom: 2px solid #e0e0e0;">
              <h3 style="margin: 0 0 20px 0; color: #333; font-size: 18px;">Client Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="background: white;">
                  <td style="padding: 12px; border: 1px solid #e0e0e0; color: #666; font-weight: bold;">Client Name:</td>
                  <td style="padding: 12px; border: 1px solid #e0e0e0; color: #333;">${variables.clientName || 'N/A'}</td>
                </tr>
                <tr style="background: #fafafa;">
                  <td style="padding: 12px; border: 1px solid #e0e0e0; color: #666; font-weight: bold;">Email:</td>
                  <td style="padding: 12px; border: 1px solid #e0e0e0; color: #333;"><a href="mailto:${variables.clientEmail}" style="color: #667eea; text-decoration: none;">${variables.clientEmail || 'N/A'}</a></td>
                </tr>
              </table>
            </div>
            <div style="padding: 30px; background: #f9f9f9; border-bottom: 2px solid #e0e0e0;">
              <h3 style="margin: 0 0 20px 0; color: #333; font-size: 18px;">Order Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="background: white;">
                  <td style="padding: 12px; border: 1px solid #e0e0e0; color: #666; font-weight: bold;">Package Type:</td>
                  <td style="padding: 12px; border: 1px solid #e0e0e0; color: #333; font-weight: 500;">${variables.packageType || 'N/A'}</td>
                </tr>
                <tr style="background: #fafafa;">
                  <td style="padding: 12px; border: 1px solid #e0e0e0; color: #666; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 12px; border: 1px solid #e0e0e0; color: #667eea; font-weight: bold; font-size: 16px;">${variables.totalAmount || '0'} ${variables.currency || 'USD'}</td>
                </tr>
              </table>
            </div>
            <div style="padding: 30px; background: white; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; color: #666; font-size: 14px;">Order received on ${new Date().toLocaleString()}</p>
              <p style="margin: 15px 0 0 0; color: #999; font-size: 12px;">Please review this order in your admin dashboard</p>
            </div>
          </div>
        </div>
      `;
    } else if (templateType === 'proposal-email') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; text-align: center; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; font-size: 28px;">Website Proposal</h2>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
            <p style="color: #555; font-size: 16px;">Hi ${variables.clientName || 'there'},</p>
            <p style="color: #555; font-size: 16px; margin-bottom: 20px;">Your website proposal is ready for review.</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 10px 0;"><strong>Order Number:</strong> ${variables.orderNumber || 'N/A'}</p>
              <a href="${variables.proposalUrl || '#'}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 10px; font-weight: bold;">View Proposal</a>
            </div>
          </div>
        </div>
      `;
    }

    const mailOptions = {
      from: process.env.GMAIL_EMAIL || 'danielminto13@gmail.com',
      to,
      subject,
      html: htmlContent,
    };

    console.log(`[sendEmail] Sending email to ${to} with subject "${subject}"`);

    const info = await transporter.sendMail(mailOptions);

    console.log(`[sendEmail] Email sent successfully. MessageID: ${info.messageId}`);
    return { success: true };
  } catch (error) {
    console.error('[sendEmail] Error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function sendOrderConfirmation(
  clientEmail: string,
  orderNumber: string,
  packageType: string,
  totalAmount: number,
  currency: string
) {
  return sendEmail(clientEmail, 'Order Confirmation', 'order-confirmation', {
    orderNumber,
    packageType,
    totalAmount,
    currency,
    clientEmail,
  });
}

export async function sendAdminNotification(
  orderNumber: string,
  clientName: string,
  clientEmail: string,
  packageType: string,
  totalAmount: number
) {
  const adminEmail = process.env.ADMIN_EMAIL_ADDRESS || 'danielminto13@gmail.com';

  return sendEmail(adminEmail, 'New Order Received', 'admin-notification', {
    orderNumber,
    clientName,
    clientEmail,
    packageType,
    totalAmount,
  });
}

export async function sendProposalEmail(
  recipientEmail: string,
  clientName: string,
  orderNumber: string,
  proposalUrl: string
) {
  return sendEmail(recipientEmail, 'Website Proposal for Review', 'proposal-email', {
    clientName,
    orderNumber,
    proposalUrl,
  });
}

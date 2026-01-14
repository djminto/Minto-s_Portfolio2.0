# EmailJS Setup Guide

This guide will help you set up EmailJS for order confirmation emails in Minto's Portfolio.

## Overview

The application uses EmailJS to send:
1. **Admin Notifications** - Order details sent to danielminto13@gmail.com
2. **Client Confirmations** - Order receipt confirmation sent to the customer

## Step 1: Create EmailJS Account

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service

1. Click on **"Email Services"** in the left sidebar
2. Click **"Add New Service"**
3. Choose your email provider (Gmail recommended):
   - **Gmail**: Select "Gmail" and connect your Google account
   - **Other**: You can use Outlook, Yahoo, or custom SMTP
4. For Gmail (danielminto13@gmail.com):
   - Click "Connect Account"
   - Sign in with your Google account
   - Allow EmailJS access
5. Copy the **Service ID** (looks like: `service_xxxxxxx`)
6. Save this Service ID for later

## Step 3: Create Admin Template

1. Click on **"Email Templates"** in the left sidebar
2. Click **"Create New Template"**
3. Configure the template:
   - **Template Name**: "Admin Order Notification"
   - **Subject**: `New Order Received - {{order_number}}`
   - **Content**:
   ```
   Hello Daniel,

   You have received a new order!

   ORDER DETAILS:
   ---------------
   Order Number: {{order_number}}
   Client Name: {{client_name}}
   Client Email: {{client_email}}
   Package: {{package_type}}
   Total Amount: {{total_amount}}
   Deposit Required: {{deposit_amount}}

   MESSAGE:
   {{message}}

   Please log into your dashboard to view full details.

   This is an automated notification from Minto's Portfolio.
   ```
4. **To Email**: Set to `{{to_email}}` (dynamic)
5. **From Name**: "Minto's Portfolio"
6. **Reply To**: `{{client_email}}`
7. Click **"Save"**
8. Copy the **Template ID** (looks like: `template_xxxxxxx`)

## Step 4: Create Client Template

1. Click **"Create New Template"** again
2. Configure the template:
   - **Template Name**: "Client Order Confirmation"
   - **Subject**: `Order Confirmation - {{order_number}}`
   - **Content**:
   ```
   Dear {{to_name}},

   Thank you for your order!

   We have successfully received your order and will begin processing it shortly.

   ORDER SUMMARY:
   ---------------
   Order Number: {{order_number}}
   Package: {{package_type}}
   Total Amount: {{total_amount}}
   50% Deposit Required: {{deposit_amount}}

   NEXT STEPS:
   1. You will receive a proposal document with full project details
   2. A 50% deposit is required to begin development
   3. We will contact you within 24-48 hours to discuss payment and timeline

   PAYMENT DETAILS:
   Bank: Scotiabank
   Account Name: Daniel Minto
   Account Number: 000-8060-154
   Branch: Spanish Town
   Reference: Use order number {{order_number}}

   If you have any questions, please don't hesitate to contact us.

   Best regards,
   Daniel Minto
   Minto's Portfolio
   danielminto13@gmail.com
   +1 (876) 386-4417
   ```
3. **To Email**: Set to `{{to_email}}` (dynamic)
4. **From Name**: "Minto's Portfolio"
5. **Reply To**: "danielminto13@gmail.com"
6. Click **"Save"**
7. Copy the **Template ID**

## Step 5: Get Public Key

1. Click on **"Account"** in the left sidebar
2. Navigate to the **"General"** tab
3. Find your **Public Key** (looks like a long string)
4. Copy this key

## Step 6: Configure Environment Variables

1. Open your `.env.local` file (or create one from `.env.example`)
2. Add the following variables with your actual values:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_ADMIN=template_admin_xxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CLIENT=template_client_xxx
```

3. Replace the placeholder values with the IDs you copied
4. Save the file

## Step 7: Test the Integration

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to the order page
3. Complete an order
4. Check both:
   - Your admin email (danielminto13@gmail.com)
   - The customer email you provided

## Template Variables Reference

### Admin Template Variables:
- `{{to_email}}` - Admin email (danielminto13@gmail.com)
- `{{to_name}}` - Admin name
- `{{order_number}}` - Unique order identifier
- `{{client_name}}` - Customer's name
- `{{client_email}}` - Customer's email
- `{{package_type}}` - Selected package (Basic/Standard/Professional/Enterprise)
- `{{total_amount}}` - Total order amount with currency
- `{{deposit_amount}}` - 50% deposit amount
- `{{message}}` - Additional message text

### Client Template Variables:
- `{{to_email}}` - Customer's email
- `{{to_name}}` - Customer's name
- `{{order_number}}` - Unique order identifier
- `{{package_type}}` - Selected package
- `{{total_amount}}` - Total order amount with currency
- `{{deposit_amount}}` - 50% deposit amount
- `{{message}}` - Confirmation message

## Troubleshooting

### Emails Not Sending
1. **Check EmailJS Dashboard**: Look for failed emails in the "Email Logs"
2. **Verify Service Connection**: Make sure Gmail is properly connected
3. **Check Template IDs**: Ensure all IDs are correct in `.env.local`
4. **Browser Console**: Check for errors in the browser console
5. **Gmail Settings**: If using Gmail, make sure "Less secure app access" is not blocking

### Wrong Email Content
1. Check template variable names match exactly (case-sensitive)
2. Verify template content in EmailJS dashboard
3. Test with EmailJS "Test" feature before using in app

### Rate Limiting
- Free EmailJS accounts have a limit of 200 emails/month
- Upgrade to a paid plan if you need more

## Production Deployment

When deploying to production:
1. Add environment variables to your hosting platform (Vercel, Netlify, etc.)
2. Update email templates with production domain links
3. Test email delivery in production environment
4. Monitor EmailJS dashboard for delivery status

## Support

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: support@emailjs.com
- Project Issues: Create an issue in the GitHub repository

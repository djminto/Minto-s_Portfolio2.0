import jsPDF from 'jspdf';

export interface ProposalData {
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  totalAmount: number;
  currency: string;
  description?: string;
  createdDate: Date;
  websiteType?: string;
  numPages?: string;
  features?: string[];
  colorScheme?: string;
  pageTypes?: string[];
  completionDate?: string;
  budgetRange?: string;
}

// Helper to format feature labels
const formatFeatureName = (featureId: string): string => {
  const featureMap: Record<string, string> = {
    'responsive': 'Responsive Design',
    '3d': '3D Animations',
    'cms': 'Content Management System',
    'ecommerce': 'E-Commerce Integration',
    'seo': 'SEO Optimization',
    'analytics': 'Analytics Integration',
    'chatbot': 'AI Chatbot',
    'payment': 'Payment Gateway Integration'
  };
  return featureMap[featureId] || featureId;
};

export const generateProposal = (data: ProposalData): string => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Header with Gradient Effect
  pdf.setFillColor(25, 91, 153); // Blue color
  pdf.rect(0, 0, pageWidth, 45, 'F');
  
  // Decorative line under header
  pdf.setDrawColor(255, 255, 255);
  pdf.setLineWidth(0.5);
  pdf.line(0, 45, pageWidth, 45);

  // Logo / Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(26);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Minto's Portfolio", pageWidth / 2, 20, { align: 'center' });
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Professional Web Development Services', pageWidth / 2, 32, { align: 'center' });

  // Reset text color
  pdf.setTextColor(0, 0, 0);

  // Title with underline
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PROJECT PROPOSAL', 20, 60);
  pdf.setDrawColor(25, 91, 153);
  pdf.setLineWidth(0.8);
  pdf.line(20, 63, 115, 63);

  // Proposal Details
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(`Proposal #: ${data.orderNumber}`, 20, 75);
  pdf.text(`Date: ${new Date(data.createdDate).toLocaleDateString()}`, 20, 81);

  // Client Information Section with box
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);
  pdf.rect(15, 90, pageWidth - 30, 22, 'S');
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(25, 91, 153);
  pdf.text('CLIENT INFORMATION', 20, 100);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Name: ${data.clientName}`, 20, 107);
  // Split email into multiple lines if too long to fit in box
  const emailText = `Email: ${data.clientEmail}`;
  const emailLines = pdf.splitTextToSize(emailText, 160);
  pdf.text(emailLines, 20, 113);

  // Package Details Section with box - dynamic height
  let currentY = 118;
  let detailsContent: string[] = [];
  detailsContent.push(`Package: ${data.packageType}`);
  if (data.websiteType) detailsContent.push(`Website Type: ${data.websiteType}`);
  if (data.numPages) detailsContent.push(`Number of Pages: ${data.numPages}`);
  if (data.colorScheme) detailsContent.push(`Color Scheme: ${data.colorScheme}`);
  if (data.features && data.features.length > 0) {
    const formattedFeatures = data.features.map(f => formatFeatureName(f)).join(', ');
    detailsContent.push(`Features: ${formattedFeatures}`);
  }
  if (data.pageTypes && data.pageTypes.length > 0) {
    detailsContent.push(`Page Types: ${data.pageTypes.join(', ')}`);
  }
  if (data.completionDate) detailsContent.push(`Desired Completion Date: ${data.completionDate}`);
  if (data.budgetRange) detailsContent.push(`Budget Range: ${data.budgetRange}`);
  if (data.description) detailsContent.push(`Project Description: ${data.description}`);
  
  // Calculate package box height
  const packageBoxHeight = 10 + (detailsContent.length * 6) + (data.description ? 10 : 0);
  pdf.rect(15, currentY, pageWidth - 30, packageBoxHeight, 'S');
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(25, 91, 153);
  currentY += 10;
  pdf.text('PACKAGE DETAILS', 20, currentY);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  currentY += 6;
  
  // Add each detail line
  detailsContent.forEach((line) => {
    const lines = pdf.splitTextToSize(line, 160);
    pdf.text(lines, 20, currentY);
    currentY += lines.length * 5;
  });

  currentY += 8;

  // Pricing Section with highlighted box
  pdf.setFillColor(245, 247, 250);
  pdf.rect(15, currentY, pageWidth - 30, 30, 'FD');
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(25, 91, 153);
  pdf.text('PRICING', 20, currentY + 8);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Total Amount: ${data.currency} ${data.totalAmount.toLocaleString()}`, 20, currentY + 15);
  pdf.text(`50% Deposit Required: ${data.currency} ${(data.totalAmount / 2).toLocaleString()}`, 20, currentY + 21);
  pdf.text(`Balance Due on Completion: ${data.currency} ${(data.totalAmount / 2).toLocaleString()}`, 20, currentY + 27);

  currentY += 35;

  // Payment Terms Section
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(25, 91, 153);
  pdf.text('PAYMENT TERMS', 20, currentY);
  
  pdf.setFontSize(8.5);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  pdf.text('• 50% deposit required to begin development', 20, currentY + 7);
  pdf.text('• 50% balance due upon project completion', 20, currentY + 12);
  pdf.text('• All payments must be made before project delivery', 20, currentY + 17);

  currentY += 25;

  // Bank Details Section with box
  pdf.setDrawColor(200, 200, 200);
  pdf.rect(15, currentY, pageWidth - 30, 35, 'S');
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(25, 91, 153);
  pdf.text('BANK TRANSFER DETAILS', 20, currentY + 8);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Bank: Scotiabank', 20, currentY + 15);
  pdf.text('Account Name: Daniel Minto', 20, currentY + 20);
  pdf.text('Account Number: 000-8060-154', 20, currentY + 25);
  pdf.text('Branch: Spanish Town', 20, currentY + 30);

  currentY += 42;

  // Check if we need a new page for signature section
  if (currentY > pageHeight - 60) {
    pdf.addPage();
    currentY = 20;
  }

  // Signature Section with proper spacing
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(25, 91, 153);
  pdf.text('CLIENT SIGNATURE', 20, currentY);
  
  currentY += 10;
  
  // Signature line
  pdf.setDrawColor(100, 100, 100);
  pdf.setLineWidth(0.5);
  pdf.line(20, currentY, 120, currentY);
  
  // Date line
  pdf.line(130, currentY, 190, currentY);
  
  currentY += 8;
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(80, 80, 80);
  pdf.text('Signature', 20, currentY);
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, 130, currentY);

  currentY += 15;

  // Footer with contact info
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);
  pdf.line(15, currentY, pageWidth - 15, currentY);
  
  currentY += 7;
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text('Contact: danielminto13@gmail.com | Phone: +1 (876) 386-4417', pageWidth / 2, currentY, { align: 'center' });

  return pdf.output('dataurlstring');
};

export const downloadProposal = (data: ProposalData) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Header with Gradient Effect
  pdf.setFillColor(25, 91, 153); // Blue color
  pdf.rect(0, 0, pageWidth, 45, 'F');
  
  // Decorative line under header
  pdf.setDrawColor(255, 255, 255);
  pdf.setLineWidth(0.5);
  pdf.line(0, 45, pageWidth, 45);

  // Logo / Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(26);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Minto's Portfolio", pageWidth / 2, 20, { align: 'center' });
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Professional Web Development Services', pageWidth / 2, 32, { align: 'center' });

  // Reset text color
  pdf.setTextColor(0, 0, 0);

  // Title with underline
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PROJECT PROPOSAL', 20, 60);
  pdf.setDrawColor(25, 91, 153);
  pdf.setLineWidth(0.8);
  pdf.line(20, 63, 115, 63);

  // Proposal Details
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(`Proposal #: ${data.orderNumber}`, 20, 75);
  pdf.text(`Date: ${new Date(data.createdDate).toLocaleDateString()}`, 20, 81);

  // Client Information Section with box
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);
  pdf.rect(15, 90, pageWidth - 30, 22, 'S');
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(25, 91, 153);
  pdf.text('CLIENT INFORMATION', 20, 100);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Name: ${data.clientName}`, 20, 107);
  // Split email into multiple lines if too long to fit in box
  const emailText = `Email: ${data.clientEmail}`;
  const emailLines = pdf.splitTextToSize(emailText, 160);
  pdf.text(emailLines, 20, 113);

  // Package Details Section with box - dynamic height
  let currentY = 118;
  let detailsContent: string[] = [];
  detailsContent.push(`Package: ${data.packageType}`);
  if (data.websiteType) detailsContent.push(`Website Type: ${data.websiteType}`);
  if (data.numPages) detailsContent.push(`Number of Pages: ${data.numPages}`);
  if (data.colorScheme) detailsContent.push(`Color Scheme: ${data.colorScheme}`);
  if (data.features && data.features.length > 0) {
    const formattedFeatures = data.features.map(f => formatFeatureName(f)).join(', ');
    detailsContent.push(`Features: ${formattedFeatures}`);
  }
  if (data.pageTypes && data.pageTypes.length > 0) {
    detailsContent.push(`Page Types: ${data.pageTypes.join(', ')}`);
  }
  if (data.completionDate) detailsContent.push(`Desired Completion Date: ${data.completionDate}`);
  if (data.budgetRange) detailsContent.push(`Budget Range: ${data.budgetRange}`);
  if (data.description) detailsContent.push(`Project Description: ${data.description}`);
  
  // Calculate package box height
  const packageBoxHeight = 10 + (detailsContent.length * 6) + (data.description ? 10 : 0);
  pdf.rect(15, currentY, pageWidth - 30, packageBoxHeight, 'S');
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(25, 91, 153);
  currentY += 10;
  pdf.text('PACKAGE DETAILS', 20, currentY);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  currentY += 6;
  
  // Add each detail line
  detailsContent.forEach((line) => {
    const lines = pdf.splitTextToSize(line, 160);
    pdf.text(lines, 20, currentY);
    currentY += lines.length * 5;
  });

  currentY += 8;

  // Pricing Section with highlighted box
  pdf.setFillColor(245, 247, 250);
  pdf.rect(15, currentY, pageWidth - 30, 30, 'FD');
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(25, 91, 153);
  pdf.text('PRICING', 20, currentY + 8);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Total Amount: ${data.currency} ${data.totalAmount.toLocaleString()}`, 20, currentY + 15);
  pdf.text(`50% Deposit Required: ${data.currency} ${(data.totalAmount / 2).toLocaleString()}`, 20, currentY + 21);
  pdf.text(`Balance Due on Completion: ${data.currency} ${(data.totalAmount / 2).toLocaleString()}`, 20, currentY + 27);

  currentY += 35;

  // Payment Terms Section
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(25, 91, 153);
  pdf.text('PAYMENT TERMS', 20, currentY);
  
  pdf.setFontSize(8.5);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  pdf.text('• 50% deposit required to begin development', 20, currentY + 7);
  pdf.text('• 50% balance due upon project completion', 20, currentY + 12);
  pdf.text('• All payments must be made before project delivery', 20, currentY + 17);

  currentY += 25;

  // Bank Details Section with box
  pdf.setDrawColor(200, 200, 200);
  pdf.rect(15, currentY, pageWidth - 30, 35, 'S');
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(25, 91, 153);
  pdf.text('BANK TRANSFER DETAILS', 20, currentY + 8);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Bank: Scotiabank', 20, currentY + 15);
  pdf.text('Account Name: Daniel Minto', 20, currentY + 20);
  pdf.text('Account Number: 000-8060-154', 20, currentY + 25);
  pdf.text('Branch: Spanish Town', 20, currentY + 30);

  currentY += 42;

  // Check if we need a new page for signature section
  if (currentY > pageHeight - 60) {
    pdf.addPage();
    currentY = 20;
  }

  // Signature Section with proper spacing
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(25, 91, 153);
  pdf.text('CLIENT SIGNATURE', 20, currentY);
  
  currentY += 10;
  
  // Signature line
  pdf.setDrawColor(100, 100, 100);
  pdf.setLineWidth(0.5);
  pdf.line(20, currentY, 120, currentY);
  
  // Date line
  pdf.line(130, currentY, 190, currentY);
  
  currentY += 8;
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(80, 80, 80);
  pdf.text('Signature', 20, currentY);
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, 130, currentY);

  currentY += 15;

  // Footer with contact info
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);
  pdf.line(15, currentY, pageWidth - 15, currentY);
  
  currentY += 7;
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text('Contact: danielminto13@gmail.com | Phone: +1 (876) 386-4417', pageWidth / 2, currentY, { align: 'center' });

  pdf.save(`Proposal-${data.orderNumber}.pdf`);
};


import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  userId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName?: string;
  packageType: 'Basic' | 'Standard' | 'Professional' | 'Enterprise';
  websiteType?: string;
  numPages?: string;
  features?: string[];
  colorScheme?: string;
  pageTypes?: string[];
  completionDate?: string;
  budgetRange?: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Card';
  totalAmount: number;
  currency: 'JMD' | 'USD';
  orderNumber: string;
  proposalSigned: boolean;
  signatureData?: string;
  signedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  companyName: { type: String },
  packageType: { type: String, enum: ['Basic', 'Standard', 'Professional', 'Enterprise'], required: true },
  websiteType: { type: String },
  numPages: { type: String },
  features: [{ type: String }],
  colorScheme: { type: String },
  pageTypes: [{ type: String }],
  completionDate: { type: String },
  budgetRange: { type: String },
  description: { type: String },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['Cash', 'Bank Transfer', 'Card'], required: true },
  totalAmount: { type: Number, required: true },
  currency: { type: String, enum: ['JMD', 'USD'], default: 'JMD' },
  orderNumber: { type: String, unique: true, required: true },
  proposalSigned: { type: Boolean, default: false },
  signatureData: { type: String },
  signedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

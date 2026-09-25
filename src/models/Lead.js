import mongoose from 'mongoose';

export const LEAD_TYPES = ['contact', 'project'];
export const LEAD_STATUSES = ['new', 'contacted', 'in_progress', 'won', 'lost'];

const leadSchema = new mongoose.Schema(
  {
    type: { type: String, enum: LEAD_TYPES, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    service: { type: String, trim: true },
    budget: { type: String, trim: true },
    timeline: { type: String, trim: true },
    message: { type: String, required: true },
    status: { type: String, enum: LEAD_STATUSES, default: 'new', index: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

leadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model('Lead', leadSchema);

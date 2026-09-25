import { z } from 'zod';
import { LEAD_STATUSES } from '../models/Lead.js';

const name = z.string({ required_error: 'Enter your name' }).trim().min(2, 'Enter your name').max(100);
const email = z.string({ required_error: 'Enter your email address' }).trim().toLowerCase().email('Enter a valid email address').max(200);
const optional = (max) => z.string().trim().max(max).optional().or(z.literal(''));

// `website` is a honeypot field: hidden from people, filled in by bots.
const honeypot = z.string().optional();

export const contactSchema = z.object({
  name,
  email,
  company: optional(120),
  phone: optional(40),
  message: z.string({ required_error: 'Tell us about your project' }).trim().min(10, 'Tell us a little more (10+ characters)').max(5000),
  website: honeypot,
});

export const projectInquirySchema = contactSchema.extend({
  service: optional(80),
  budget: optional(60),
  timeline: optional(60),
});

export const newsletterSchema = z.object({
  email,
  source: optional(60),
  website: honeypot,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password').max(200),
});

export const leadUpdateSchema = z
  .object({
    status: z.enum(LEAD_STATUSES).optional(),
    notes: z.string().max(5000).optional(),
  })
  .refine((v) => v.status !== undefined || v.notes !== undefined, 'Nothing to update');

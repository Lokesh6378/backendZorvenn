import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = env.smtp.host
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
    })
  : null;

/** Emails the team about a new lead. Never throws — a mail failure must not lose the lead. */
export async function notifyNewLead(lead) {
  if (!transporter || !env.notifyEmail) return;

  const lines = [`Type: ${lead.type === 'project' ? 'Project inquiry' : 'Contact message'}`];
  lines.push(`Name: ${lead.name}`, `Email: ${lead.email}`);
  if (lead.company) lines.push(`Company: ${lead.company}`);
  if (lead.phone) lines.push(`Phone: ${lead.phone}`);
  if (lead.service) lines.push(`Service: ${lead.service}`);
  if (lead.budget) lines.push(`Budget: ${lead.budget}`);
  if (lead.timeline) lines.push(`Timeline: ${lead.timeline}`);
  lines.push('', lead.message);

  try {
    await transporter.sendMail({
      from: env.smtp.from,
      to: env.notifyEmail,
      replyTo: lead.email,
      subject: `New ${lead.type === 'project' ? 'project inquiry' : 'message'} from ${lead.name}`,
      text: lines.join('\n'),
    });
  } catch (err) {
    console.error('Lead email failed:', err.message);
  }
}

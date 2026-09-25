import { Lead } from '../models/Lead.js';
import { Subscriber } from '../models/Subscriber.js';
import { notifyNewLead } from '../services/mailer.js';

const LEAD_RECEIVED = "Thanks — we've got your message and will reply within 2 business days.";

function createLead(type) {
  return async (req, res) => {
    const { website, ...data } = req.body;
    // Honeypot filled in: pretend success so bots learn nothing, but store nothing.
    if (website) return res.status(201).json({ message: LEAD_RECEIVED });

    const lead = await Lead.create({ ...data, type });
    notifyNewLead(lead);
    res.status(201).json({ message: LEAD_RECEIVED, id: lead._id });
  };
}

export const createContact = createLead('contact');
export const createProjectInquiry = createLead('project');

export async function subscribe(req, res) {
  const { email, source, website } = req.body;
  if (!website) {
    await Subscriber.updateOne(
      { email },
      { $setOnInsert: { email, source: source || 'website' } },
      { upsert: true }
    );
  }
  res.status(201).json({ message: "You're on the list. We'll email you when we launch." });
}

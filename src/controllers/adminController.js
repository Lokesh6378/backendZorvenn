import { Lead, LEAD_STATUSES, LEAD_TYPES } from '../models/Lead.js';
import { Subscriber } from '../models/Subscriber.js';

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function paging(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

export async function getStats(req, res) {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [totalLeads, newLeads, last30Days, subscribers, byStatusRaw, recent] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: 'new' }),
    Lead.countDocuments({ createdAt: { $gte: since } }),
    Subscriber.countDocuments(),
    Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Lead.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const byStatus = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0]));
  byStatusRaw.forEach((row) => { byStatus[row._id] = row.count; });

  res.json({ totalLeads, newLeads, last30Days, subscribers, byStatus, recent });
}

export async function listLeads(req, res) {
  const { page, limit, skip } = paging(req.query);
  const filter = {};
  if (LEAD_STATUSES.includes(req.query.status)) filter.status = req.query.status;
  if (LEAD_TYPES.includes(req.query.type)) filter.type = req.query.type;
  if (typeof req.query.q === 'string' && req.query.q.trim()) {
    const rx = new RegExp(escapeRegex(req.query.q.trim()), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { company: rx }];
  }

  const [items, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Lead.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
}

export async function getLead(req, res) {
  const lead = await Lead.findById(req.params.id).lean();
  if (!lead) return res.status(404).json({ message: 'Lead not found.' });
  res.json(lead);
}

export async function updateLead(req, res) {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
  if (!lead) return res.status(404).json({ message: 'Lead not found.' });
  res.json(lead);
}

export async function deleteLead(req, res) {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found.' });
  res.status(204).end();
}

export async function listSubscribers(req, res) {
  const { page, limit, skip } = paging(req.query);
  const filter = {};
  if (typeof req.query.q === 'string' && req.query.q.trim()) {
    filter.email = new RegExp(escapeRegex(req.query.q.trim()), 'i');
  }
  const [items, total] = await Promise.all([
    Subscriber.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Subscriber.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
}

export async function deleteSubscriber(req, res) {
  const sub = await Subscriber.findByIdAndDelete(req.params.id);
  if (!sub) return res.status(404).json({ message: 'Subscriber not found.' });
  res.status(204).end();
}

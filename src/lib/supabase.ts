import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Mocking if no credentials
const isMock = !supabaseUrl || !supabaseKey;

export const supabase = isMock ? null : createClient(supabaseUrl, supabaseKey);

import { AuditResult } from './types';

export async function saveAudit(audit: AuditResult) {
  if (isMock) {
    console.log("Mock Save Audit:", audit);
    return { data: audit, error: null };
  }
  return await supabase!.from('audits').insert([audit]).select().single();
}

export async function captureLead(lead: { email: string; audit_id: string; company?: string; team_size?: number }) {
  if (isMock) {
    console.log("Mock Capture Lead:", lead);
    return { data: lead, error: null };
  }
  return await supabase!.from('leads').insert([lead]).select().single();
}

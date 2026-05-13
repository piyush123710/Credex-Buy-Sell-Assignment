import { NextRequest, NextResponse } from 'next/server';
import { captureLead } from '@/lib/supabase';
import { sendAuditConfirmation } from '@/lib/email';
import { z } from 'zod';

const leadSchema = z.object({
  email: z.string().email(),
  audit_id: z.string().uuid(),
  company: z.string().optional(),
  team_size: z.coerce.number().optional(),
  savings: z.coerce.number(),
  honeypot: z.string().max(0, "Bot detected").optional(), // Honeypot must be empty
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Validation
    const validatedData = leadSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.message }, { status: 400 });
    }

    const { email, audit_id, company, team_size, savings } = validatedData.data;

    // 2. Storage
    const { error: dbError } = await captureLead({
      email,
      audit_id,
      company,
      team_size,
    });

    if (dbError) {
      console.error("DB Error capturing lead:", dbError);
      // Continue anyway to send email if DB fails? Or fail? 
      // Usually, lead capture is critical.
    }

    // 3. Email Notification
    await sendAuditConfirmation(email, savings);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_123');

export async function sendAuditConfirmation(email: string, savings: number) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`Mock Email: Sending audit confirmation to ${email} with savings of $${savings}`);
    return { success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'SpendWise Audits <audits@credex.rocks>',
      to: [email],
      subject: 'Your AI Spend Audit is Ready!',
      html: `
        <h1>Your Spend Audit Results</h1>
        <p>Thanks for using SpendWise. We identified <strong>$${savings}/mo</strong> in potential savings.</p>
        <p>If you're looking to capture these savings immediately, reply to this email to speak with a Credex expert.</p>
        <br/>
        <p>Best,<br/>The Credex Team</p>
      `,
    });

    if (error) {
      console.error("Email Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (e) {
    console.error("Email Exception:", e);
    return { success: false, error: e };
  }
}

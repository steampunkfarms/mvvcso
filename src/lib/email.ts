import { Resend } from 'resend';
import { env } from './env';

const resend = env.hasResend ? new Resend(env.resendApiKey) : null;

const FROM_ADDRESS = 'MVVCSO <noreply@mvvcso.org>';
const FALLBACK_FROM = 'MVVCSO <noreply@mvvcso.vercel.app>';

function getFrom(address?: string): string {
  return address ?? FROM_ADDRESS;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.log(`[EMAIL-DEV] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL-DEV] Body:\n${html}`);
    return { success: true };
  }

  try {
    await resend.emails.send({
      from: getFrom(from),
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[EMAIL-ERROR] ${message}`);
    return { success: false, error: message };
  }
}

export async function sendMagicLink(email: string, token: string, name: string): Promise<{ success: boolean; error?: string }> {
  const verifyUrl = `${env.siteUrl}/admin/verify?token=${token}`;

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <h2 style="color: #3d2e1f; margin-bottom: 8px;">Sign in to MVVCSO Admin</h2>
      <p style="color: #6b5744;">Hello ${name},</p>
      <p style="color: #6b5744;">Click the button below to sign in. This link expires in 15 minutes.</p>
      <a href="${verifyUrl}" style="
        display: inline-block;
        background: #ca7e56;
        color: white;
        padding: 12px 32px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        margin: 16px 0;
      ">Sign In</a>
      <p style="color: #9a8b7a; font-size: 14px;">
        If you didn't request this, you can safely ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #e9cb8d; margin: 24px 0;" />
      <p style="color: #9a8b7a; font-size: 12px;">
        MVVCSO — Montezuma Valley Volunteer Community Service Organization
      </p>
    </div>
  `;

  if (!resend) {
    console.log(`[MAGIC-LINK-DEV] ${email} → ${verifyUrl}`);
    return { success: true };
  }

  return sendEmail({
    to: email,
    subject: 'Sign in to MVVCSO Admin',
    html,
    from: getFrom(),
  });
}

import { Resend } from "resend";
import { ENV } from "./env";

export type OwnerEmail = {
  /** Subject line of the notification email. */
  subject: string;
  /** Plain-text body. */
  text: string;
  /** Optional Reply-To so the owner can reply straight to the lead. */
  replyTo?: string;
};

let _resend: Resend | null = null;

const getResend = (): Resend | null => {
  if (!ENV.resendApiKey) return null;
  if (!_resend) _resend = new Resend(ENV.resendApiKey);
  return _resend;
};

/**
 * Sends a notification email to the site owner (NOTIFICATION_EMAIL) via Resend.
 *
 * This is best-effort: it never throws. It returns `true` when Resend accepted
 * the message and `false` when email is not configured or the send failed, so
 * callers can still complete the user-facing flow (e.g. save the lead) even if
 * the email could not go out. Details are logged for debugging.
 */
export async function sendOwnerEmail(email: OwnerEmail): Promise<boolean> {
  const resend = getResend();

  if (!resend) {
    console.warn(
      `[Email] RESEND_API_KEY is not set — skipping owner notification: "${email.subject}"`
    );
    return false;
  }

  if (!ENV.notificationEmail) {
    console.warn(
      `[Email] NOTIFICATION_EMAIL is not set — skipping owner notification: "${email.subject}"`
    );
    return false;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: ENV.emailFrom,
      to: ENV.notificationEmail,
      subject: email.subject,
      text: email.text,
      ...(email.replyTo ? { replyTo: email.replyTo } : {}),
    });

    if (error) {
      console.error("[Email] Resend rejected the message:", error);
      return false;
    }

    console.log(`[Email] Sent "${email.subject}" (id: ${data?.id ?? "unknown"})`);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send owner notification:", err);
    return false;
  }
}

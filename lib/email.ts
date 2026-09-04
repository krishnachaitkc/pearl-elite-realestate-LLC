import { Resend } from "resend";
import type { EnquiryFormData } from "@/lib/validations";

const DEFAULT_NOTIFICATION_EMAIL = "info@pearlgateelite.com";
const DEFAULT_FROM_EMAIL = "Pearl Gate Elite <noreply@pearlgateelite.com>";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getNotificationEmail() {
  return (
    process.env.ENQUIRY_NOTIFICATION_EMAIL?.trim() || DEFAULT_NOTIFICATION_EMAIL
  );
}

function getFromEmail() {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
}

function formatEnquiryType(type: EnquiryFormData["type"]) {
  return type.replace(/_/g, " ");
}

function buildEnquiryEmailHtml(data: EnquiryFormData, enquiryId: string) {
  const rows = [
    ["Name", data.name],
    ["Phone", data.phone || "—"],
    ["Email", data.email || "—"],
    ["Type", formatEnquiryType(data.type)],
    ["Source", data.source || "website"],
    ["Property ID", data.propertyId || "—"],
    ["Agent ID", data.agentId || "—"],
    ["Message", data.message || "—"],
    ["Enquiry ID", enquiryId],
  ];

  const bodyRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;color:#374151;vertical-align:top;">${label}</td><td style="padding:8px 12px;color:#111827;">${String(value).replace(/\n/g, "<br>")}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
      <h2 style="color:#111827;margin-bottom:16px;">New website enquiry</h2>
      <p style="color:#4b5563;margin-bottom:24px;">A visitor submitted the contact form on pearlgateelite.com.</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        ${bodyRows}
      </table>
    </div>
  `;
}

export async function sendEnquiryNotification(
  data: EnquiryFormData,
  enquiryId: string
): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("[EMAIL] RESEND_API_KEY not configured — skipping enquiry notification");
    return;
  }

  const to = getNotificationEmail();
  const from = getFromEmail();
  const subject = `New ${formatEnquiryType(data.type)} from ${data.name}`;

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html: buildEnquiryEmailHtml(data, enquiryId),
    replyTo: data.email || undefined,
  });

  if (error) {
    console.error("[EMAIL] Failed to send enquiry notification:", error);
  }
}

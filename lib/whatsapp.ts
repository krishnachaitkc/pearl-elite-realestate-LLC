/**
 * WhatsApp URL builder — reads numbers from site settings (not hardcoded).
 * Supports: general, property-specific, and agent-specific messages.
 */

export function buildWhatsAppUrl(
  number: string,
  message?: string
): string {
  const clean = number.replace(/\D/g, "");
  const encoded = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${clean}${encoded ? `?text=${encoded}` : ""}`;
}

export function propertyWhatsAppMessage(
  propertyTitle: string,
  referenceNo: string,
  agentName?: string
): string {
  return `Hello${agentName ? ` ${agentName}` : ""},\n\nI'm interested in the following property:\n*${propertyTitle}*\nRef: ${referenceNo}\n\nPlease contact me with more details.`;
}

export function agentWhatsAppMessage(agentName: string): string {
  return `Hello ${agentName},\n\nI found your profile on Pearl Gate Elite Real Estate. I'd like to get in touch regarding properties.`;
}

export function generalWhatsAppMessage(): string {
  return `Hello Pearl Gate Elite Real Estate,\n\nI'm interested in learning more about your properties. Could you please assist me?`;
}

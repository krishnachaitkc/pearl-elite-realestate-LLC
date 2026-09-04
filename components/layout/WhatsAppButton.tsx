"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  whatsappNumber: string;
  message?: string;
}

export default function WhatsAppButton({
  whatsappNumber,
  message = "Hello Pearl Gate Elite! I'm interested in your properties.",
}: WhatsAppButtonProps) {
  const clean = whatsappNumber.replace(/\D/g, "");
  const url = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} className="text-white" fill="white" />
    </a>
  );
}

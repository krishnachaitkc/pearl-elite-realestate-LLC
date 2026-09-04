import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEnquiryNotification } from "@/lib/email";
import { enquirySchema } from "@/lib/validations";

// Rate limiting — simple in-memory (use Redis in production)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 enquiries per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before submitting again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
        message: parsed.data.message || null,
        type: parsed.data.type,
        source: parsed.data.source || "website",
        propertyId: parsed.data.propertyId || null,
        agentId: parsed.data.agentId || null,
      },
    });

    try {
      await sendEnquiryNotification(parsed.data, enquiry.id);
    } catch (emailError) {
      console.error("[ENQUIRY_POST] Email notification failed:", emailError);
    }

    return NextResponse.json(
      { success: true, id: enquiry.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[ENQUIRY_POST]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Admin only — protected by middleware + session check
  return NextResponse.json({ message: "Use admin dashboard to view enquiries." });
}

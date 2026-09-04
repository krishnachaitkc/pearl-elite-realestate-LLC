import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { testimonialSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const parsed = testimonialSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const data = parsed.data;
  const testimonial = await prisma.testimonial.create({ data: { ...data, photoUrl: data.photoUrl || null } });
  return NextResponse.json(testimonial, { status: 201 });
}

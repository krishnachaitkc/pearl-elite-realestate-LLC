import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { testimonialSchema } from "@/lib/validations";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const parsed = testimonialSchema.partial().safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const data = parsed.data;
  if (data.photoUrl !== undefined) data.photoUrl = data.photoUrl || null;
  return NextResponse.json(await prisma.testimonial.update({ where: { id: (await params).id }, data }));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  await prisma.testimonial.delete({ where: { id: (await params).id } });
  return NextResponse.json({ success: true });
}

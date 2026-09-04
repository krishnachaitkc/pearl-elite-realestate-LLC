import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { enquiryStatusSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const parsed = enquiryStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const existing = await prisma.enquiry.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  }

  const enquiry = await prisma.enquiry.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(enquiry);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await prisma.enquiry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

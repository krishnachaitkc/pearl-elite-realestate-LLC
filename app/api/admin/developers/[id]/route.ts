import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { developerSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const parsed = developerSchema.partial().safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const existing = await prisma.developer.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const data = parsed.data;
  const updateData: Record<string, unknown> = { ...data };
  if (data.name && data.name !== existing.name) {
    let slug = generateSlug(data.name);
    if (await prisma.developer.findFirst({ where: { slug, NOT: { id } } })) slug = `${slug}-${Date.now()}`;
    updateData.slug = slug;
  }
  if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl || null;
  if (data.website !== undefined) updateData.website = data.website || null;
  return NextResponse.json(await prisma.developer.update({ where: { id }, data: updateData }));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  await prisma.developer.delete({ where: { id: (await params).id } });
  return NextResponse.json({ success: true });
}

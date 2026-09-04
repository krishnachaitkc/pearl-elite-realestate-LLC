import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { communitySchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const parsed = communitySchema.partial().safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const existing = await prisma.community.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const data = parsed.data;
  const updateData: Record<string, unknown> = { ...data };
  if (data.name && data.name !== existing.name) {
    let slug = generateSlug(data.name);
    if (await prisma.community.findFirst({ where: { slug, NOT: { id } } })) slug = `${slug}-${Date.now()}`;
    updateData.slug = slug;
  }
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl || null;
  return NextResponse.json(await prisma.community.update({ where: { id }, data: updateData }));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  await prisma.community.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

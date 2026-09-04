import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { articleSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const parsed = articleSchema.partial().safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const data = parsed.data;
  const updateData: Record<string, unknown> = { ...data };
  if (data.title && data.title !== existing.title) {
    let slug = generateSlug(data.title);
    if (await prisma.article.findFirst({ where: { slug, NOT: { id } } })) slug = `${slug}-${Date.now()}`;
    updateData.slug = slug;
  }
  if (data.coverImageUrl !== undefined) updateData.coverImageUrl = data.coverImageUrl || null;
  if (data.published === true && !existing.publishedAt) updateData.publishedAt = new Date();
  return NextResponse.json(await prisma.article.update({ where: { id }, data: updateData }));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  await prisma.article.delete({ where: { id: (await params).id } });
  return NextResponse.json({ success: true });
}

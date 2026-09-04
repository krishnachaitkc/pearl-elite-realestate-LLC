import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { agentSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const parsed = agentSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const existing = await prisma.agent.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = parsed.data;
  const updateData: Record<string, unknown> = { ...data };
  if (data.name && data.name !== existing.name) {
    let slug = generateSlug(data.name);
    if (await prisma.agent.findFirst({ where: { slug, NOT: { id } } })) {
      slug = `${slug}-${Date.now()}`;
    }
    updateData.slug = slug;
  }

  const agent = await prisma.agent.update({ where: { id }, data: updateData });
  return NextResponse.json(agent);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await prisma.agent.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

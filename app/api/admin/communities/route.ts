import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { communitySchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const parsed = communitySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const data = parsed.data;
  let slug = generateSlug(data.name);
  if (await prisma.community.findUnique({ where: { slug } })) slug = `${slug}-${Date.now()}`;
  const community = await prisma.community.create({ data: { ...data, slug, imageUrl: data.imageUrl || null } });
  return NextResponse.json(community, { status: 201 });
}

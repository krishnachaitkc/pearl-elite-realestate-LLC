import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { developerSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const parsed = developerSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const data = parsed.data;
  let slug = generateSlug(data.name);
  if (await prisma.developer.findUnique({ where: { slug } })) slug = `${slug}-${Date.now()}`;
  const developer = await prisma.developer.create({
    data: { ...data, slug, logoUrl: data.logoUrl || null, website: data.website || null },
  });
  return NextResponse.json(developer, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { articleSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const parsed = articleSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const data = parsed.data;
  let slug = generateSlug(data.title);
  if (await prisma.article.findUnique({ where: { slug } })) slug = `${slug}-${Date.now()}`;
  const article = await prisma.article.create({
    data: {
      ...data,
      slug,
      coverImageUrl: data.coverImageUrl || null,
      publishedAt: data.published ? new Date() : null,
    },
  });
  return NextResponse.json(article, { status: 201 });
}

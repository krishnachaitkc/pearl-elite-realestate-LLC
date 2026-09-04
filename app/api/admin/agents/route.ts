import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { agentSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = agentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const data = parsed.data;
  let slug = generateSlug(data.name);
  if (await prisma.agent.findUnique({ where: { slug } })) {
    slug = `${slug}-${Date.now()}`;
  }

  const agent = await prisma.agent.create({ data: { ...data, slug } });
  return NextResponse.json(agent, { status: 201 });
}

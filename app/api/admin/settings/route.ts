import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { settingsSchema } from "@/lib/validations";

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const data = parsed.data;
  await Promise.all(
    Object.entries(data).map(([key, value]) =>
      prisma.siteSetting.update({
        where: { key },
        data: { value: value ?? "" },
      })
    )
  );

  return NextResponse.json({ success: true });
}

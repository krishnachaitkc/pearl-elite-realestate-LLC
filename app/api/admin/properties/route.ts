import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { propertySchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = propertySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const { amenityIds, completionDate, floorPlanUrl, videoUrl, ...rest } = data;

  let slug = generateSlug(data.title);
  const slugExists = await prisma.property.findUnique({ where: { slug } });
  if (slugExists) slug = `${slug}-${Date.now()}`;

  const refExists = await prisma.property.findUnique({
    where: { referenceNo: data.referenceNo },
  });
  if (refExists) {
    return NextResponse.json(
      { error: "Reference number already exists" },
      { status: 409 }
    );
  }

  const property = await prisma.property.create({
    data: {
      ...rest,
      slug,
      floorPlanUrl: floorPlanUrl || null,
      videoUrl: videoUrl || null,
      completionDate: completionDate ? new Date(completionDate) : null,
      amenities: amenityIds.length
        ? { create: amenityIds.map((amenityId) => ({ amenityId })) }
        : undefined,
    },
  });

  return NextResponse.json(property, { status: 201 });
}

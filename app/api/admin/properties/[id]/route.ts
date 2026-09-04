import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";
import { propertySchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";
import { z } from "zod";

const patchSchema = propertySchema.partial().extend({
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const data = parsed.data;
  const { amenityIds, completionDate, floorPlanUrl, videoUrl, title, referenceNo, ...rest } = data;

  if (referenceNo && referenceNo !== existing.referenceNo) {
    const refExists = await prisma.property.findUnique({ where: { referenceNo } });
    if (refExists) {
      return NextResponse.json(
        { error: "Reference number already exists" },
        { status: 409 }
      );
    }
  }

  const updateData: Record<string, unknown> = { ...rest };

  if (title && title !== existing.title) {
    let slug = generateSlug(title);
    const slugExists = await prisma.property.findFirst({
      where: { slug, NOT: { id } },
    });
    if (slugExists) slug = `${slug}-${Date.now()}`;
    updateData.title = title;
    updateData.slug = slug;
  }

  if (referenceNo) updateData.referenceNo = referenceNo;
  if (completionDate !== undefined) {
    updateData.completionDate = completionDate ? new Date(completionDate) : null;
  }
  if (floorPlanUrl !== undefined) updateData.floorPlanUrl = floorPlanUrl || null;
  if (videoUrl !== undefined) updateData.videoUrl = videoUrl || null;

  const property = await prisma.$transaction(async (tx) => {
    if (amenityIds !== undefined) {
      await tx.propertyAmenity.deleteMany({ where: { propertyId: id } });
      if (amenityIds.length) {
        await tx.propertyAmenity.createMany({
          data: amenityIds.map((amenityId) => ({ propertyId: id, amenityId })),
        });
      }
    }

    return tx.property.update({
      where: { id },
      data: updateData,
    });
  });

  return NextResponse.json(property);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  await prisma.property.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

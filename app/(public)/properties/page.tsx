import { prisma } from "@/lib/db";
import { PropertyCard } from "@/components/home/FeaturedProperties";
import PropertyFilters from "@/components/properties/PropertyFilters";
import SortDropdown from "@/components/properties/SortDropdown";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse our full portfolio of premium rental properties across the UAE.",
};

interface PropertiesPageProps {
  searchParams: Promise<{
    priceType?: string;
    status?: string;
    propertyType?: string;
    location?: string;
    community?: string;
    developer?: string;
    bedrooms?: string;
    bathrooms?: string;
    minPrice?: string;
    maxPrice?: string;
    minArea?: string;
    maxArea?: string;
    furnished?: string;
    featured?: string;
    q?: string;
    page?: string;
    sort?: string;
  }>;
}

const PAGE_SIZE = 12;

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const sort = params.sort || "newest";

  // Build filter
  const where: any = { published: true };

  if (params.priceType) where.priceType = params.priceType;
  if (params.status) where.status = params.status;
  if (params.propertyType) where.propertyType = params.propertyType;
  if (params.furnished) where.furnished = params.furnished;
  if (params.featured === "true") where.featured = true;
  if (params.bedrooms) where.bedrooms = { gte: parseInt(params.bedrooms) };
  if (params.bathrooms) where.bathrooms = { gte: parseInt(params.bathrooms) };
  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = parseFloat(params.minPrice);
    if (params.maxPrice) where.price.lte = parseFloat(params.maxPrice);
  }
  if (params.minArea || params.maxArea) {
    where.area = {};
    if (params.minArea) where.area.gte = parseFloat(params.minArea);
    if (params.maxArea) where.area.lte = parseFloat(params.maxArea);
  }
  if (params.location) {
    where.location = { name: { contains: params.location, mode: "insensitive" } };
  }
  if (params.community) {
    where.community = { name: { contains: params.community, mode: "insensitive" } };
  }
  if (params.developer) {
    where.developer = { name: { contains: params.developer, mode: "insensitive" } };
  }
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
      { referenceNo: { contains: params.q, mode: "insensitive" } },
    ];
  }

  // Sort
  const orderBy: any =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
      ? { price: "desc" }
      : sort === "oldest"
      ? { createdAt: "asc" }
      : { createdAt: "desc" };

  const [properties, total, locations, developers] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        location: { select: { name: true } },
        community: { select: { name: true } },
      },
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.property.count({ where }),
    prisma.location.findMany({ where: { published: true }, orderBy: { name: "asc" } }),
    prisma.developer.findMany({ where: { published: true }, orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[var(--color-charcoal-900)] pt-20">
      {/* Page header */}
      <div className="bg-[var(--color-charcoal-900)] py-12">
        <div className="container-site">
          <span className="text-label text-[var(--color-brand-400)] block mb-2">
            {total} Properties Found
          </span>
          <h1 className="heading-section text-white text-3xl lg:text-4xl">
            {params.priceType === "RENT"
              ? "Properties for Rent"
              : "All Properties"}
          </h1>
        </div>
      </div>

      <div className="container-site py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <PropertyFilters
              currentParams={params as Record<string, string>}
              locations={locations}
              developers={developers}
            />
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[var(--color-charcoal-300)]">
                <span className="font-semibold text-white">{total}</span> properties found
              </p>
              <SortDropdown sort={sort} />
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-20 bg-[var(--color-charcoal-800)] rounded-2xl">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No properties found
                </h3>
                <p className="text-[var(--color-charcoal-400)] mb-6">
                  Try adjusting your filters to see more results.
                </p>
                <a href="/properties" className="btn-primary">
                  Clear Filters
                </a>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property as any} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {page > 1 && (
                      <a
                        href={`/properties?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
                        className="btn-secondary px-4 py-2 text-sm"
                      >
                        ← Previous
                      </a>
                    )}
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      const p = i + 1;
                      return (
                        <a
                          key={p}
                          href={`/properties?${new URLSearchParams({ ...params, page: String(p) }).toString()}`}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            p === page
                              ? "bg-[var(--color-brand-500)] text-white"
                              : "bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-300)] hover:bg-[var(--color-charcoal-900)]"
                          }`}
                        >
                          {p}
                        </a>
                      );
                    })}
                    {page < totalPages && (
                      <a
                        href={`/properties?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                        className="btn-secondary px-4 py-2 text-sm"
                      >
                        Next →
                      </a>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SortDropdown({ sort = "newest" }: { sort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(pathname + "?" + params.toString());
  };

  return (
    <select
      className="input-base w-auto text-sm cursor-pointer"
      defaultValue={sort}
      onChange={handleSort}
    >
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  );
}

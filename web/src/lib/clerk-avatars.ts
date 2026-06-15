import { cache } from "react";
import { unstable_cache } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";

async function fetchClerkImagesFromApi(
  clerkIds: string[],
): Promise<Record<string, string>> {
  if (clerkIds.length === 0) return {};

  try {
    const client = await clerkClient();
    const { data } = await client.users.getUserList({
      userId: clerkIds,
      limit: clerkIds.length,
    });
    return Object.fromEntries(
      data
        .filter((user) => user.imageUrl)
        .map((user) => [user.id, user.imageUrl as string]),
    );
  } catch (e) {
    console.error("[clerk-avatars]", e);
    return {};
  }
}

/** Batch-fetch Clerk profile image URLs; cached per request and for 5 minutes. */
export const clerkImageUrlMap = cache(async function clerkImageUrlMap(
  clerkIds: string[],
): Promise<Map<string, string>> {
  const uniqueIds = [...new Set(clerkIds.filter(Boolean))].sort();
  if (uniqueIds.length === 0) return new Map();

  const cacheKey = uniqueIds.join(",");
  const record = await unstable_cache(
    () => fetchClerkImagesFromApi(uniqueIds),
    ["clerk-avatars", cacheKey],
    { revalidate: 300 },
  )();

  return new Map(Object.entries(record));
});

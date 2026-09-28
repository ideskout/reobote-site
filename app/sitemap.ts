import type { MetadataRoute } from "next";

export const revalidate = 3600;
import { listImovelIds } from "@/lib/imoveis";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const ids = await listImovelIds();

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/imoveis`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/sobre`, changeFrequency: "monthly", priority: 0.6 },
    ...ids.map((id) => ({
      url: `${base}/imoveis/${id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}

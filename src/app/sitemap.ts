import type { MetadataRoute } from "next";
import { getServerAppUrl } from "@/lib/utils/url";

/**
 * 検索エンジン向けサイトマップ
 * https://your-domain.com/sitemap.xml で公開される
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getServerAppUrl();

  const publicPaths = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/receive-work", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/order-work", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/usage_guide", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/terms_of_service", changeFrequency: "yearly" as const, priority: 0.5 },
    { path: "/privacy_policy", changeFrequency: "yearly" as const, priority: 0.5 },
    { path: "/commercial_law", changeFrequency: "yearly" as const, priority: 0.5 },
    { path: "/security_policy", changeFrequency: "yearly" as const, priority: 0.5 },
    { path: "/service_environment", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/external_transmission", changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  return publicPaths.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}

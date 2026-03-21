import type { MetadataRoute } from "next";
import { getServerAppUrl } from "@/lib/utils/url";

/**
 * 検索エンジンのクロールルール
 * https://your-domain.com/robots.txt で公開される
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getServerAppUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/login",
          "/user_register",
          "/reset-password",
          "/password_reset",
          "/interview_schedule",
          "/caster/",
          "/order/",
          "/project/",
          "/cast/",
          "/top/order",
          "/top/caster",
          "/order/package_reservate/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

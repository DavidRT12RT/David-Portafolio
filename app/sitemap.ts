import { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/seo";

/** Both languages, each pointing at the other, so search engines serve the visitor's own. */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { es: SITE_URL, en: `${SITE_URL}/en` };
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: `${SITE_URL}/en`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9, alternates: { languages } },
  ];
}

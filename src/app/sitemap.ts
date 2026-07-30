import { MetadataRoute } from "next";

export const dynamic = "force-static";

const domain =
  process.env.NODE_ENV === "production"
    ? "https://waguy02.github.io/PHD-Research-Website"
    : "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/publications",
    "/demo",
    "/team",
    "/cv",
  ];

  return routes.map((route) => ({
    url: `${domain}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : 0.8,
  }));
}
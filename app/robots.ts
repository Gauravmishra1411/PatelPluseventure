import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://patelpulseventures.com'

  return {
    rules: {
      userAgent: '*',
      allow: "/",
      disallow: ["/admin/*"],
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-categories.xml`,
      `${baseUrl}/sitemap-products.xml`
    ],
  }
}
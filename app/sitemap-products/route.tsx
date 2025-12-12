import { NextResponse } from 'next/server'
import { generateSitemapProducts } from '../sitemap'

export async function GET() {
  const products = await generateSitemapProducts()
  
  // Generate XML sitemap for products
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
      ${products.map(item => `
        <url>
          <loc>${item.url}</loc>
          <lastmod>${item.lastModified.toISOString().split('T')[0]}</lastmod>
          <changefreq>${item.changeFrequency}</changefreq>
          <priority>${item.priority}</priority>
        </url>
      `).join('')}
    </urlset>
  `

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      'encoding': 'UTF-8'
    }
  })
}

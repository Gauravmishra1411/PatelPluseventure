import { NextResponse } from 'next/server'
import { generateSitemapCategories } from '../sitemap'

export async function GET() {
  const categories = await generateSitemapCategories()
  
  // Generate XML sitemap for categories
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${categories.map(item => `
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

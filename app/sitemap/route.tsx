import { NextResponse } from 'next/server'
import { generateSitemapIndex } from '../sitemap'

export async function GET() {
  const sitemap = await generateSitemapIndex()

  // Generate XML sitemap
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemap.sitemaps.sitemaps.map(sitemap => `
        <sitemap>
          <loc>https://patelpulseventures.com${sitemap.url}</loc>
          <lastmod>${sitemap.lastModified.toISOString().split('T')[0]}</lastmod>
        </sitemap>
      `).join('')}
    </sitemapindex>
  `

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      'encoding': 'UTF-8'
    }
  })
}

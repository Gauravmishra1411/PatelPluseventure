import { MetadataRoute } from 'next'

// Base configuration
const baseUrl = 'https://patelpulseventures.com'
const currentDate = new Date()

// Main sitemap with static routes
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Main pages
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...[
      'about',
      'services',
      'projects',
      'testimonials',
      'contact',
      'chat',
      'onboarding',
      'leave-review',
    ].map(route => ({
      url: `${baseUrl}/${route}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),

    // Legal pages
    ...['privacy', 'terms', 'cookies'].map(route => ({
      url: `${baseUrl}/${route}`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ]
}

// Generate sitemap for marketplace categories
export async function generateSitemapCategories() {
  // In a real app, fetch categories from your database
  const categories = [
    { id: 'web-development', updatedAt: currentDate },
    { id: 'mobile-apps', updatedAt: currentDate },
    { id: 'ai-solutions', updatedAt: currentDate },
    { id: 'cloud-services', updatedAt: currentDate },
  ]

  return categories.map(category => ({
    url: `${baseUrl}/marketplace/categories/${category.id}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
}

// Generate sitemap for marketplace products
export async function generateSitemapProducts() {
  // In a real app, fetch products from your database
  const products = [
    { id: 'product-1', updatedAt: currentDate },
    { id: 'product-2', updatedAt: currentDate },
    // Add more products as needed
  ]

  return products.map(product => ({
    url: `${baseUrl}/marketplace/products/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
}

// Sitemap index that combines all sitemaps
export async function generateSitemapIndex() {
  const baseSitemap = sitemap()
  const categorySitemap = await generateSitemapCategories()
  const productSitemap = await generateSitemapProducts()

  return {
    sitemaps: {
      index: true,
      sitemaps: [
        {
          url: '/sitemap.xml',
          lastModified: currentDate,
        },
        {
          url: '/sitemap-categories.xml',
          lastModified: currentDate,
        },
        {
          url: '/sitemap-products.xml',
          lastModified: currentDate,
        },
      ],
    },
    // Combine all sitemaps for the main sitemap.xml
    ...baseSitemap,
    ...categorySitemap,
    ...productSitemap,
  }
}
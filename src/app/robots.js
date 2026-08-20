import { meta } from '@/lib/data/meta';

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${meta.siteUrl}/sitemap.xml`,
  };
}

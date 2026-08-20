import { fullProjects } from '@/lib/data/projects';
import { meta } from '@/lib/data/meta';

// The homepage is a canvas, so crawlers find little to follow there. A sitemap
// is the strongest discovery signal the reading pages have.
export default function sitemap() {
  const routes = ['', '/kontak', ...fullProjects.map((p) => `/kerja/${p.slug}`)];
  return routes.map((path) => ({
    url: `${meta.siteUrl}${path}`,
    lastModified: new Date(),
  }));
}

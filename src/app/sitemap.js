import { fullProjects } from '@/lib/data/projects';
import { meta } from '@/lib/data/meta';

// `/` is the gate at desktop widths and the paper document everywhere else, so
// what a crawler follows from there varies. A sitemap is the strongest discovery
// signal the reading pages have.
//
// `/sistem` is deliberately absent: its canonical points back at `/`, and
// listing both would undo that.
export default function sitemap() {
  const routes = ['', '/kontak', ...fullProjects.map((p) => `/kerja/${p.slug}`)];
  return routes.map((path) => ({
    url: `${meta.siteUrl}${path}`,
    lastModified: new Date(),
  }));
}

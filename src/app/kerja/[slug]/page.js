import { notFound } from 'next/navigation';
import { fullProjects, bySlug, siblings } from '@/lib/data/projects';
import ProjectView from '@/components/work/ProjectView';

export function generateStaticParams() {
  return fullProjects.map((p) => ({ slug: p.slug }));
}

// Metadata is rendered on the server, so it is always Indonesian —
// the locale only exists in the browser. That matches the audience.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project) return {};
  return {
    // The root layout's title template already appends " — Utsman".
    title: project.title.id,
    description: project.context.id,
    openGraph: {
      title: project.title.id,
      description: project.context.id,
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project || project.tier !== 'full') notFound();
  const { prev, next } = siblings(slug);
  return <ProjectView project={project} prev={prev} next={next} />;
}

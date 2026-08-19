import { meta } from '@/lib/data/meta';

export default function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Utsman',
    jobTitle: 'Fullstack Web Developer',
    email: meta.email,
    url: meta.siteUrl,
    sameAs: [meta.github, meta.instagram],
    knowsAbout: [
      'Healthcare technology',
      'Electronic Medical Records',
      'BPJS / IDRG / SatuSehat integration',
      'OCR pipelines',
      'Laravel',
      'React',
      'Next.js',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Banjarbaru',
      addressRegion: 'Kalimantan Selatan',
      addressCountry: 'ID',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

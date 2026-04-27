"use client";

import { Mail, Phone, Github, Instagram, MapPin, Download, ArrowUpRight } from 'lucide-react';
import { useLocale } from '@/lib/hooks/useLocale';
import { meta } from '@/lib/data/meta';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/ui/FadeIn';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function ContactCard({ icon: Icon, label, value, href, ext = false, delay = 0 }) {
  return (
    <FadeIn delay={delay} y={14} duration={650}>
    <a
      href={href}
      {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group relative flex items-center gap-4 p-4 md:p-5 border border-rule rounded-md overflow-hidden transition-[transform,border-color,box-shadow] duration-500 hover:border-amber hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgba(201,123,63,0.45)]"
      style={{ transitionTimingFunction: EASE }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber/0 to-amber/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      <span
        aria-hidden
        className="relative shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full border border-rule text-mute transition-[border-color,color,transform] duration-500 group-hover:border-amber group-hover:text-amber group-hover:rotate-[-6deg]"
        style={{ transitionTimingFunction: EASE }}
      >
        <Icon size={16} />
      </span>
      <div className="relative min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
          {label}
        </p>
        <p className="text-sm md:text-base text-forest dark:text-cream truncate group-hover:text-amber transition-colors duration-300">
          {value}
        </p>
      </div>
      {ext && (
        <ArrowUpRight
          size={14}
          className="relative shrink-0 text-mute transition-[transform,color] duration-500 group-hover:text-amber group-hover:translate-x-1 group-hover:-translate-y-1"
          style={{ transitionTimingFunction: EASE }}
        />
      )}
    </a>
    </FadeIn>
  );
}

export default function Contact() {
  const { locale, t } = useLocale();

  const items = [
    { icon: Mail, label: t('contact.email'), value: meta.email, href: `mailto:${meta.email}` },
    { icon: Phone, label: t('contact.whatsapp'), value: meta.whatsapp, href: meta.whatsappLink, ext: true },
    { icon: Github, label: t('contact.github'), value: meta.githubHandle, href: meta.github, ext: true },
    { icon: Instagram, label: t('contact.instagram'), value: meta.instagramHandle, href: meta.instagram, ext: true },
  ];

  return (
    <section
      id="contact"
      className="py-16 md:py-20 px-6 border-t border-rule bg-cream-deep/40 dark:bg-forest/30"
    >
      <div className="max-w-6xl mx-auto">
        <SectionTitle eyebrow={t('contact.intro')}>{t('contact.title')}</SectionTitle>

        <div className="grid sm:grid-cols-2 gap-3 md:gap-4 max-w-3xl">
          {items.map((it, i) => (
            <ContactCard key={it.label} {...it} delay={i * 90} />
          ))}
        </div>

        <FadeIn delay={items.length * 90 + 60} className="mt-6 flex flex-wrap items-center gap-4 max-w-3xl">
          <div className="flex items-center gap-2 text-sm text-mute">
            <MapPin size={14} className="text-amber" />
            <span>{meta.location[locale]}</span>
          </div>

          <a
            href={meta.cvFile}
            download
            className="group ml-auto relative overflow-hidden inline-flex items-center gap-2 bg-forest text-cream dark:bg-cream dark:text-forest px-5 py-3 text-sm font-semibold tracking-wide rounded-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
          >
            <span
              aria-hidden
              className="absolute inset-0 bg-amber origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
            <Download
              size={16}
              className="relative z-10 group-hover:text-cream transition-colors duration-300"
            />
            <span className="relative z-10 group-hover:text-cream transition-colors duration-300">
              {t('contact.downloadCV')}
            </span>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

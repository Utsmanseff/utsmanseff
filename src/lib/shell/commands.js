import { FILTER_KEYS } from './filters';

// Parsing returns an intent and touches nothing. The shell decides what an
// intent does; that split is what lets the whole command table be tested
// without rendering anything.
export function parseCommand(raw) {
  const s = String(raw ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (!s) return { action: 'none' };

  if (s === 'help') return { action: 'help' };
  if (s === 'ls' || s === 'ls systems' || s === 'ls modules') return { action: 'list' };
  if (s === 'reset') return { action: 'reset' };
  if (s === 'contact' || s === 'cv') return { action: 'contact' };
  if (s === 'view flat' || s === 'flat' || s === 'list') return { action: 'view', view: 'list' };
  if (s === 'view iso' || s === 'iso' || s === 'map') return { action: 'view', view: 'map' };
  if (s === 'lang id') return { action: 'lang', lang: 'id' };
  if (s === 'lang en') return { action: 'lang', lang: 'en' };

  if (s.startsWith('open')) {
    const query = s.slice(4).trim();
    return query ? { action: 'open', query } : { action: 'unknown', input: s };
  }

  const body = s.startsWith('filter ') ? s.slice(7).trim() : s;
  const colon = body.indexOf(':');
  if (colon > 0) {
    const key = body.slice(0, colon).trim();
    const value = body.slice(colon + 1).trim();
    if (FILTER_KEYS.includes(key) && value) return { action: 'filter', key, value };
  }

  return { action: 'unknown', input: s };
}

// Matching is deliberately loose: a visitor types what they can see on a plate,
// not a slug.
export function findSystem(systems, query) {
  const q = query.toLowerCase();
  return systems.find((s) => (
    s.slug.startsWith(q)
    || s.slug.replace(/-/g, '').startsWith(q.replace(/-/g, ''))
    || s.shortName.id.toLowerCase().includes(q)
    || s.shortName.en.toLowerCase().includes(q)
    || s.title.id.toLowerCase().includes(q)
    || s.title.en.toLowerCase().includes(q)
  )) ?? null;
}

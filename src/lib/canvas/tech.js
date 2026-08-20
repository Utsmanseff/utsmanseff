// The stack, derived from the work rather than declared next to it. A grid of
// logos says "I have heard of these"; a legend built from `project.tech` says
// where each one was actually used, and how often. It doubles as the map's
// filter: picking a technology dims everything that does not use it.

// Ordered by how much work backs the claim, then alphabetically so equal counts
// do not shuffle between renders.
export function techIndex(projects) {
  const byName = new Map();

  for (const p of projects) {
    for (const name of p.tech ?? []) {
      const entry = byName.get(name) ?? { name, count: 0, slugs: new Set() };
      entry.count += 1;
      entry.slugs.add(p.slug);
      byName.set(name, entry);
    }
  }

  return [...byName.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );
}

// One technology used once, on a project nobody can open, is noise on the map.
// Everything used more than once stays; the rest is reachable in the panels.
export function primaryTech(projects, min = 2) {
  const all = techIndex(projects);
  const kept = all.filter((t) => t.count >= min);
  return kept.length > 0 ? kept : all;
}

export function usesTech(project, name) {
  return Boolean(name) && (project.tech ?? []).includes(name);
}

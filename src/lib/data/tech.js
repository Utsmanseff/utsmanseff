// The stack as a filter vocabulary, nothing more. An earlier version counted
// uses and marked the once-used ones "rare"; that was praising the work with
// its own data, and it is gone. Names only, no numbers anywhere.

export function techNames(projects) {
  const seen = new Set();
  for (const p of projects) {
    for (const name of p.tech ?? []) seen.add(name);
  }
  return [...seen].sort((a, b) => a.localeCompare(b));
}

// Filter values travel through the console as lowercase, punctuation-free
// tokens: `stack:tensorflowjs` has to match "TensorFlow.js" without asking a
// visitor to guess where the dot goes.
export function techSlug(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]/g, '');
}

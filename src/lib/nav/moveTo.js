// Everything this project knows about the View Transitions API lives here.
//
// The gate sits above the systems: going up is going back, going down is going
// in. A reading page sits inside a system rather than above or below it, so it
// gets its own direction — the panel that stands for the open system and the
// page's head block share a transition name, and the browser morphs one into
// the other.
//
// One value, not two. Which way the zoom runs is already decided by which
// element carries the name on each side, so coming back needs no direction of
// its own — and that is what makes it safe for the reading page to set the
// direction on mount, where the browser's back button can be served too.
//
// This function does NOT call startViewTransition. Measured in Chrome 148:
// wrapping router.push in it by hand captures the OLD DOM twice, because React
// renders after the snapshot is taken — the animation then runs between two
// pictures of the same page. What drives the transition instead is the
// <ViewTransition> boundary in the root layout: React calls the API itself,
// once the new tree is ready.
//
// So the whole job here is to say which way we are going, early enough for the
// CSS to pick a keyframe, and then navigate.

const DIRECTIONS = ['up', 'down', 'zoom'];

export function moveTo(router, href, direction) {
  const known = DIRECTIONS.includes(direction);

  // No keyframes for an unknown direction, and nothing to animate in a browser
  // without the API. Both navigate plainly — the page still changes, it cuts.
  if (known && typeof document.startViewTransition === 'function') {
    document.documentElement.dataset.nav = direction;
  }

  return router.push(href);
}

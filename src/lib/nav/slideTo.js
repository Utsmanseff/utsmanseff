// Everything this project knows about the View Transitions API lives here.
//
// The gate sits above the systems. Going up is going back, going down is going
// in, and the direction is written on the root element because the
// ::view-transition-* pseudo-elements live there, not inside the React tree.
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

const DIRECTIONS = ['up', 'down'];

export function slideTo(router, href, direction) {
  const known = DIRECTIONS.includes(direction);

  // No keyframes for an unknown direction, and nothing to animate in a browser
  // without the API. Both navigate plainly — the page still changes, it cuts.
  if (known && typeof document.startViewTransition === 'function') {
    document.documentElement.dataset.nav = direction;
  }

  return router.push(href);
}

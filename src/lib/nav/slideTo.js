// Everything this project knows about the View Transitions API lives here.
//
// The gate sits above the systems. Going up is going back, going down is going
// in, and the direction is written on the root element because the
// ::view-transition-* pseudo-elements live there, not inside the React tree.
//
// Measured in Chrome 148 before this was written: calling router.push inside
// startViewTransition by hand captures the OLD DOM twice — React renders after
// the snapshot is taken. What makes the capture correct is the <ViewTransition>
// boundary in the root layout, which lets React drive the transition itself.
// This function still calls the API directly so the direction is set and a
// browser without the boundary still navigates.

const DIRECTIONS = ['up', 'down'];

export function slideTo(router, href, direction) {
  const known = DIRECTIONS.includes(direction);

  const go = () => router.push(href);

  if (!known || typeof document.startViewTransition !== 'function') {
    // No animation to run: a browser without the API, or a caller with a
    // direction we have no keyframes for. Navigating plainly is the right
    // answer to both — the page still changes, it just cuts.
    return go();
  }

  // Written before the transition starts. The pseudo-elements are created the
  // moment startViewTransition runs, and a direction set afterwards arrives
  // after the keyframes have already been chosen.
  document.documentElement.dataset.nav = direction;
  return document.startViewTransition(go);
}

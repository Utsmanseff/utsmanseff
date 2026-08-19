// Pure pan/zoom maths. No DOM, no React — everything here is testable alone.
//
// Convention: screen = world * zoom + offset.
// A viewport is { x, y, zoom }, where x/y is the screen position of world origin.

export const MIN_ZOOM = 0.45;
export const MAX_ZOOM = 1.8;

// Zoom below this shows names only; at or above it, nodes add stack and year.
export const DETAIL_THRESHOLD = 0.85;

// Total pointer travel, in px, still treated as a click rather than a drag.
export const DRAG_THRESHOLD = 6;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function panBy(viewport, dx, dy) {
  return { x: viewport.x + dx, y: viewport.y + dy, zoom: viewport.zoom };
}

export function worldToScreen(viewport, point) {
  return {
    x: point.x * viewport.zoom + viewport.x,
    y: point.y * viewport.zoom + viewport.y,
  };
}

export function screenToWorld(viewport, point) {
  return {
    x: (point.x - viewport.x) / viewport.zoom,
    y: (point.y - viewport.y) / viewport.zoom,
  };
}

// Zoom around a screen anchor, keeping the world point beneath it fixed.
export function zoomAt(viewport, factor, anchor) {
  const zoom = clamp(viewport.zoom * factor, MIN_ZOOM, MAX_ZOOM);
  const world = screenToWorld(viewport, anchor);
  return {
    zoom,
    x: anchor.x - world.x * zoom,
    y: anchor.y - world.y * zoom,
  };
}

// Frame every node with `padding` px of breathing room on all sides.
export function fitToNodes(nodes, size, padding = 60) {
  if (nodes.length === 0) {
    return { x: size.width / 2, y: size.height / 2, zoom: 1 };
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.position.x - n.radius);
    minY = Math.min(minY, n.position.y - n.radius);
    maxX = Math.max(maxX, n.position.x + n.radius);
    maxY = Math.max(maxY, n.position.y + n.radius);
  }

  const boxW = Math.max(maxX - minX, 1);
  const boxH = Math.max(maxY - minY, 1);
  const zoom = clamp(
    Math.min((size.width - padding * 2) / boxW, (size.height - padding * 2) / boxH),
    MIN_ZOOM,
    MAX_ZOOM
  );

  const centreX = (minX + maxX) / 2;
  const centreY = (minY + maxY) / 2;
  return {
    zoom,
    x: size.width / 2 - centreX * zoom,
    y: size.height / 2 - centreY * zoom,
  };
}

export function detailLevel(zoom) {
  return zoom >= DETAIL_THRESHOLD ? 'near' : 'far';
}

export function isClick(travel) {
  return travel <= DRAG_THRESHOLD;
}

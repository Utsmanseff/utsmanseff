"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  panBy, zoomAt, fitToNodes, detailLevel, isClick,
} from '@/lib/canvas/viewport';
import { primaryTech, usesTech } from '@/lib/canvas/tech';
import { CENTER_NODE, NODE_RADIUS, OTHERS_NODE, WORLD } from '@/lib/data/canvas';
import Node from './Node';
import GroupNode from './GroupNode';
import Edges from './Edges';
import PreviewPanel from './PreviewPanel';
import CanvasChrome from './CanvasChrome';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function fitTargets(mapped, hasOthers) {
  return [
    { position: CENTER_NODE.position, radius: NODE_RADIUS.center },
    ...mapped.map((p) => ({ position: p.position, radius: NODE_RADIUS[p.tier] })),
    ...(hasOthers ? [{ position: OTHERS_NODE.position, radius: NODE_RADIUS.group }] : []),
  ];
}

export default function Canvas({ projects, locale }) {
  // Only the projects with a page of their own get a node. The rest sit behind
  // one "other work" node, so the map has four things to say instead of eight
  // near-identical circles.
  const mapped = projects.filter((p) => p.tier === 'full');
  const others = projects.filter((p) => p.tier !== 'full');

  const surfaceRef = useRef(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const [openSlug, setOpenSlug] = useState(null);
  // The stack legend's selection. Null means no filter, which is the only state
  // that leaves the map at full strength.
  const [activeTech, setActiveTech] = useState(null);
  // Eased only for programmatic moves; dragging must track the finger exactly.
  const [eased, setEased] = useState(false);

  // `suppressClick` is set when a pointer gesture turns out to be a drag, so the
  // click the browser synthesises afterwards does not open a panel. It is a flag
  // rather than a reading of `travel`, because keyboard activation fires a click
  // with no pointer gesture at all — judging it by the last drag's distance made
  // Enter on a focused node do nothing after any pan.
  const drag = useRef({ active: false, travel: 0, lastX: 0, lastY: 0, suppressClick: false });

  // One timer for every self-driven move. Each move used to schedule its own,
  // so tabbing through nodes quickly let an earlier timer switch easing off
  // while a later pan was still running, snapping it to a stop.
  const easeTimer = useRef(null);

  const easeBriefly = useCallback(() => {
    setEased(true);
    clearTimeout(easeTimer.current);
    easeTimer.current = setTimeout(() => setEased(false), 950);
  }, []);

  useEffect(() => () => clearTimeout(easeTimer.current), []);

  const fit = useCallback(() => {
    const box = surfaceRef.current?.getBoundingClientRect();
    if (!box) return;
    easeBriefly();
    setViewport(fitToNodes(
      fitTargets(mapped, others.length > 0),
      { width: box.width, height: box.height },
      80,
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, easeBriefly]);

  useEffect(() => {
    // The opening framing needs the surface's measured size, so it can only be
    // computed after mount. Mount-only on purpose: re-fitting whenever `projects`
    // changes identity would yank a visitor's own pan back mid-exploration.
    fit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tabbing to a node that sits off-screen would look like nothing happened.
  // A mouse click focuses the button too, though, and someone who just clicked a
  // node they can already see does not want the map sliding out from under them —
  // worse, it can slide the node under the panel that is opening over it. A
  // pointer is still down when focus fires from a click, which is what tells the
  // two apart.
  const centreOn = useCallback((project) => {
    if (drag.current.active) return;
    const box = surfaceRef.current?.getBoundingClientRect();
    if (!box) return;
    easeBriefly();
    setViewport((v) => ({
      zoom: v.zoom,
      x: box.width / 2 - project.position.x * v.zoom,
      y: box.height / 2 - project.position.y * v.zoom,
    }));
  }, [easeBriefly]);

  // Capture is deliberately NOT taken here. Capturing on pointerdown retargets
  // the pointerup to the surface, so the browser resolves the click against the
  // surface instead of the node — every node click landed on the background and
  // nothing opened. Capture waits until the gesture is actually a drag.
  const onPointerDown = (e) => {
    drag.current = {
      active: true,
      travel: 0,
      lastX: e.clientX,
      lastY: e.clientY,
      suppressClick: false,
      captured: false,
    };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.lastX;
    const dy = e.clientY - d.lastY;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.travel += Math.abs(dx) + Math.abs(dy);
    // Past the threshold this is a pan, not a click, so hold the pointer to keep
    // receiving moves if it leaves the surface.
    if (!d.captured && !isClick(d.travel)) {
      surfaceRef.current?.setPointerCapture?.(e.pointerId);
      d.captured = true;
    }
    setViewport((v) => panBy(v, dx, dy));
  };

  const onPointerUp = (e) => {
    drag.current.active = false;
    drag.current.suppressClick = !isClick(drag.current.travel);
    if (drag.current.captured) {
      surfaceRef.current?.releasePointerCapture?.(e.pointerId);
      drag.current.captured = false;
    }
  };

  const onWheel = (e) => {
    const box = surfaceRef.current?.getBoundingClientRect();
    if (!box) return;
    const anchor = { x: e.clientX - box.left, y: e.clientY - box.top };
    setViewport((v) => zoomAt(v, e.deltaY < 0 ? 1.08 : 1 / 1.08, anchor));
  };

  // A node click that arrives right after a drag is the tail of that drag.
  const open = (slug) => {
    if (drag.current.suppressClick) return;
    setOpenSlug(slug);
  };

  // Every click bubbles here, including the one on empty ground that ends a pan.
  // Clearing on the way out means the flag is spent by whatever click follows the
  // gesture, and never lingers to swallow an unrelated activation later.
  const onClickCapture = () => {
    drag.current.suppressClick = false;
  };

  const tech = primaryTech(projects);
  // The group node stands for several projects, so it survives a filter if any
  // of the work behind it uses the technology.
  const groupUsesTech = others.some((p) => usesTech(p, activeTech));
  const dimmedSlugs = new Set(
    activeTech
      ? [
        ...mapped.filter((p) => !usesTech(p, activeTech)).map((p) => p.slug),
        ...(groupUsesTech ? [] : [OTHERS_NODE.slug]),
      ]
      : [],
  );

  const detail = detailLevel(viewport.zoom);
  const openProject = projects.find((p) => p.slug === openSlug) ?? null;
  const groupOpen = openSlug === OTHERS_NODE.slug;
  const panelOpen = Boolean(openProject) || groupOpen;
  // A brief project can only have been reached through the group node, so the
  // panel offers the way back rather than dumping the visitor on the canvas.
  const backToGroup = openProject && openProject.tier !== 'full'
    ? () => setOpenSlug(OTHERS_NODE.slug)
    : null;

  return (
    <div
      className="canvas-root relative w-full h-[100dvh] overflow-hidden bg-ground"
      /* `overflow-hidden` stops a visitor scrolling, not the browser. Focusing a
         node it considers off-screen scrolls this box anyway, and since the
         chrome and the preview panel are its children, the whole layer slid up
         with it — the panel's close button ended above the viewport, out of
         reach. Nothing here is meant to scroll, so refuse the scroll outright. */
      onScroll={(e) => {
        e.currentTarget.scrollTop = 0;
        e.currentTarget.scrollLeft = 0;
      }}
    >
      <div
        ref={surfaceRef}
        data-testid="canvas-surface"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onClick={onClickCapture}
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--color-ground-rule) 1px, transparent 0)',
          backgroundSize: '26px 26px',
        }}
      >
        <div
          data-testid="canvas-world"
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: WORLD.width,
            height: WORLD.height,
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transition: eased ? `transform 900ms ${EASE}` : 'none',
          }}
        >
          <Edges
            projects={mapped}
            centre={CENTER_NODE}
            extras={others.length > 0 ? [OTHERS_NODE] : []}
            dimmed={dimmedSlugs}
          />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber/60 bg-ground-soft flex flex-col items-center justify-center text-center px-4 cursor-default select-none"
            style={{
              left: CENTER_NODE.position.x,
              top: CENTER_NODE.position.y,
              width: NODE_RADIUS.center * 2,
              height: NODE_RADIUS.center * 2,
            }}
          >
            <span className="font-pixel text-2xl leading-none text-ground-ink">{CENTER_NODE.name}</span>
            <span className="font-mono text-[9px] text-ground-mute">
              {CENTER_NODE.role[locale]}
            </span>
          </div>

          {/* The centre is a label, not a target — it is the first circle anyone
              reaches for, and a dead click there reads as a broken page. Saying
              who this is out loud also puts the blurb somewhere other than the
              phone list, which was the only place it appeared. */}
          <p
            className="absolute -translate-x-1/2 text-center text-[11px] leading-relaxed text-ground-mute pointer-events-none"
            style={{
              left: CENTER_NODE.position.x,
              top: CENTER_NODE.position.y + NODE_RADIUS.center + 16,
              width: 340,
            }}
          >
            {CENTER_NODE.blurb[locale]}
          </p>

          {mapped.map((p) => (
            <Node
              key={p.slug}
              project={p}
              locale={locale}
              detail={detail}
              selected={p.slug === openSlug}
              dimmed={dimmedSlugs.has(p.slug)}
              onOpen={open}
              onFocus={centreOn}
            />
          ))}

          {others.length > 0 && (
            <GroupNode
              locale={locale}
              count={others.length}
              selected={groupOpen}
              dimmed={dimmedSlugs.has(OTHERS_NODE.slug)}
              onOpen={setOpenSlug}
              onFocus={centreOn}
            />
          )}
        </div>
      </div>

      <CanvasChrome
        locale={locale}
        onFit={fit}
        hidden={panelOpen}
        tech={tech}
        activeTech={activeTech}
        onPickTech={setActiveTech}
      />
      <PreviewPanel
        project={openProject}
        group={groupOpen ? others : null}
        locale={locale}
        onOpenOther={setOpenSlug}
        onBack={backToGroup}
        onClose={() => setOpenSlug(null)}
      />
    </div>
  );
}

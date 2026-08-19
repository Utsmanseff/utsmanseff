"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  panBy, zoomAt, fitToNodes, detailLevel, isClick,
} from '@/lib/canvas/viewport';
import { CENTER_NODE, NODE_RADIUS, WORLD } from '@/lib/data/canvas';
import Node from './Node';
import Edges from './Edges';
import PreviewPanel from './PreviewPanel';
import CanvasChrome from './CanvasChrome';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function fitTargets(projects) {
  return [
    { position: CENTER_NODE.position, radius: NODE_RADIUS.center },
    ...projects.map((p) => ({ position: p.position, radius: NODE_RADIUS[p.tier] })),
  ];
}

export default function Canvas({ projects, locale }) {
  const surfaceRef = useRef(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const [openSlug, setOpenSlug] = useState(null);
  // Eased only for programmatic moves; dragging must track the finger exactly.
  const [eased, setEased] = useState(false);

  const drag = useRef({ active: false, travel: 0, lastX: 0, lastY: 0 });

  const fit = useCallback(() => {
    const box = surfaceRef.current?.getBoundingClientRect();
    if (!box) return;
    setEased(true);
    setViewport(fitToNodes(fitTargets(projects), { width: box.width, height: box.height }, 80));
    setTimeout(() => setEased(false), 950);
  }, [projects]);

  useEffect(() => { fit(); }, [fit]);

  const onPointerDown = (e) => {
    drag.current = { active: true, travel: 0, lastX: e.clientX, lastY: e.clientY };
    surfaceRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.lastX;
    const dy = e.clientY - d.lastY;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.travel += Math.abs(dx) + Math.abs(dy);
    setViewport((v) => panBy(v, dx, dy));
  };

  const onPointerUp = (e) => {
    drag.current.active = false;
    surfaceRef.current?.releasePointerCapture?.(e.pointerId);
  };

  const onWheel = (e) => {
    const box = surfaceRef.current?.getBoundingClientRect();
    if (!box) return;
    const anchor = { x: e.clientX - box.left, y: e.clientY - box.top };
    setViewport((v) => zoomAt(v, e.deltaY < 0 ? 1.08 : 1 / 1.08, anchor));
  };

  // A node click that arrives after real dragging is a drag, not a click.
  const open = (slug) => {
    if (!isClick(drag.current.travel)) return;
    setOpenSlug(slug);
  };

  const detail = detailLevel(viewport.zoom);
  const openProject = projects.find((p) => p.slug === openSlug) ?? null;

  return (
    <div className="canvas-root relative w-full h-[100dvh] overflow-hidden bg-ground">
      <div
        ref={surfaceRef}
        data-testid="canvas-surface"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
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
          <Edges projects={projects} centre={CENTER_NODE} />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full
                       border border-amber/60 bg-ground-soft flex flex-col items-center
                       justify-center text-center px-4"
            style={{
              left: CENTER_NODE.position.x,
              top: CENTER_NODE.position.y,
              width: NODE_RADIUS.center * 2,
              height: NODE_RADIUS.center * 2,
            }}
          >
            <span className="font-display text-lg text-ground-ink">{CENTER_NODE.name}</span>
            <span className="font-mono text-[9px] text-ground-mute">
              {CENTER_NODE.role[locale]}
            </span>
          </div>

          {projects.map((p) => (
            <Node
              key={p.slug}
              project={p}
              locale={locale}
              detail={detail}
              selected={p.slug === openSlug}
              onOpen={open}
            />
          ))}
        </div>
      </div>

      <CanvasChrome locale={locale} onFit={fit} />
      <PreviewPanel project={openProject} locale={locale} onClose={() => setOpenSlug(null)} />
    </div>
  );
}

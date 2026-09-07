"use client";

import { useEffect, useRef, useState } from 'react';
import { SCENE, ROW_Y, platePositions, fitScale, snapRotation } from '@/lib/shell/layout';
import Plate from './Plate';
import AxisLegend from './AxisLegend';

const COPY = { drag: { id: 'SERET UNTUK MEMUTAR · 1:1', en: 'DRAG TO ORBIT · 1:1' } };

export default function MapScene({ systems, locale, selected, dimmed, onSelect }) {
  const paneRef = useRef(null);
  const [scale, setScale] = useState(0.4);
  const [rotZ, setRotZ] = useState(-40);
  // Dragging follows the pointer exactly; only the release is eased.
  const drag = useRef(null);

  // Measured by observing the pane, not the window: the pane is what the scene
  // has to fit, and it changes size on its own when the chrome around it does.
  // The observer also reports the first size in its own callback, so nothing
  // sets state synchronously while the effect body runs.
  useEffect(() => {
    const pane = paneRef.current;
    if (!pane || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(fitScale({ width, height }));
    });
    ro.observe(pane);
    return () => ro.disconnect();
  }, []);

  const positions = platePositions(systems);

  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, rot: rotZ };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    setRotZ(drag.current.rot + (e.clientX - drag.current.x) * 0.22);
  };
  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    setRotZ((r) => snapRotation(r));
  };

  return (
    <div className="grid grid-rows-[1fr_auto] min-h-0">
      <div
        ref={paneRef}
        data-testid="map-pane"
        className="relative overflow-hidden cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <span className="absolute right-4 top-3 font-mono text-[10px] text-muted-deep pointer-events-none">
          {COPY.drag[locale]}
        </span>

        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: SCENE.width,
            height: SCENE.height,
            perspective: 2400,
            transform: `translate(-50%, -50%) scale(${scale.toFixed(3)})`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(56deg) rotateZ(${rotZ}deg)`,
            }}
            role="group"
            aria-label={locale === 'id'
              ? 'Peta sistem: kedalaman menandai tahun, tinggi menandai jumlah teknologi'
              : 'System map: depth is the year, height is the number of technologies'}
          >
            {Object.entries(ROW_Y).map(([year, y]) => (
              <div
                key={year}
                className="absolute h-px"
                style={{ left: 20, top: y + 40, width: 700, background: year === '2026' ? '#2E3539' : '#232B30' }}
              >
                <span
                  className={`absolute font-mono text-[11px] ${year === '2026' ? 'text-amber' : 'text-muted-deep'}`}
                  style={{ left: 710, transform: `rotateZ(${-rotZ}deg) rotateX(-56deg) translate(0,-7px)` }}
                >
                  {year}
                </span>
              </div>
            ))}

            {systems.map((s, i) => (
              <Plate
                key={s.slug}
                system={s}
                position={positions[i]}
                locale={locale}
                rotZ={rotZ}
                selected={selected === s.slug}
                dimmed={dimmed.has(s.slug)}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      </div>

      <AxisLegend locale={locale} />
    </div>
  );
}

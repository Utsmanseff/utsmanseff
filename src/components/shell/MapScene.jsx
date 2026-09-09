"use client";

import { useEffect, useRef, useState } from 'react';
import { SCENE, ROW_Y, platePositions, fitScale } from '@/lib/shell/layout';
import { useMapCamera } from '@/lib/shell/useMapCamera';
import Plate from './Plate';
import AxisLegend from './AxisLegend';

// `1:1` dibuang: itu istilah kontrak gerak internal, dan tidak berarti apa-apa
// bagi pengunjung. Yang berarti adalah bahwa roda juga memutar dan badan plate
// bisa ditekan — dua hal yang selama ini benar tetapi tidak pernah dikatakan.
const COPY = {
  hints: {
    id: ['SERET ATAU GULIR · MEMUTAR', 'KLIK PLATE · MEMILIH'],
    en: ['DRAG OR SCROLL · ORBIT', 'CLICK A PLATE · SELECT'],
  },
};

export default function MapScene({ systems, locale, selected, dimmed, onSelect, angleRef, angle }) {
  const paneRef = useRef(null);
  const [scale, setScale] = useState(0.4);
  // `angle ?? undefined`, bukan `angle`: parameter bawaan -40 hanya berlaku
  // untuk undefined, sementara null akan diteruskan apa adanya.
  const camera = useMapCamera(angle ?? undefined);

  // Sudut dititipkan lewat ref, bukan dinaikkan jadi state Shell: pintu cuma
  // membacanya sekali saat ditekan, sementara state akan merender ulang rail,
  // panel dan konsol tiap klik roda.
  useEffect(() => {
    if (angleRef) angleRef.current = camera.rotZ;
  });

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

  // Seret yang kebetulan berakhir di atas plate tidak memilih sistem.
  const select = (slug) => {
    if (camera.dragged()) return;
    onSelect(slug);
  };

  return (
    <div className="grid grid-rows-[1fr_auto] min-h-0">
      <div
        ref={paneRef}
        data-testid="map-pane"
        className="relative overflow-hidden cursor-grab active:cursor-grabbing touch-none"
        {...camera.handlers}
      >
        <div className="absolute right-4 top-3 font-mono text-[10px] leading-[1.7] text-right text-muted-deep pointer-events-none">
          {COPY.hints[locale].map((line) => <div key={line}>{line}</div>)}
        </div>

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
              // Tanpa transition, dengan sengaja: kamera ini cuma digerakkan
              // jari, dan tidak ada lagi yang menariknya pulang sendiri.
              transform: `rotateX(56deg) rotateZ(${camera.rotZ}deg)`,
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
                  style={{ left: 710, transform: `rotateZ(${-camera.rotZ}deg) rotateX(-56deg) translate(0,-7px)` }}
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
                rotZ={camera.rotZ}
                selected={selected === s.slug}
                dimmed={dimmed.has(s.slug)}
                onSelect={select}
              />
            ))}
          </div>
        </div>
      </div>

      <AxisLegend locale={locale} />
    </div>
  );
}

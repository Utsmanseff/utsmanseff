"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { snapRotation } from './layout';

// Kamera peta, dan satu-satunya tempat yang tahu bagaimana ia digerakkan.
// Ia tidak tahu apa itu warna, dan tidak tahu plate mana yang terpilih.
//
// Kontrak geraknya terbelah, seperti sisa proyek ini: selama jari menempel,
// 1:1 tanpa easing.

const DRAG_PER_PX = 0.22;
const WHEEL_PER_UNIT = 0.12;
const SETTLE_MS = 180;
const EASE_MS = 700;
const START_ANGLE = -40;

export function useMapCamera(initial = START_ANGLE) {
  const [rotZ, setRotZ] = useState(initial);
  const [settling, setSettling] = useState(false);
  const drag = useRef(null);
  const quiet = useRef(null);
  const done = useRef(null);

  // Snap bukan jari; itu mesin yang bergerak sendiri, jadi ia dapat 700ms
  // seperti semua gerak lain yang tidak diseret. `settling` cuma menyala selama
  // itu — MapScene memakainya untuk menyalakan transition, lalu mematikannya
  // lagi supaya seretan berikutnya tetap 1:1.
  const settle = useCallback(() => {
    setSettling(true);
    setRotZ((r) => snapRotation(r));
    clearTimeout(done.current);
    done.current = setTimeout(() => setSettling(false), EASE_MS);
  }, []);

  useEffect(() => () => {
    clearTimeout(quiet.current);
    clearTimeout(done.current);
  }, []);

  const onPointerDown = (e) => {
    clearTimeout(quiet.current);
    clearTimeout(done.current);
    setSettling(false);
    drag.current = { x: e.clientX, rot: rotZ };
  };

  const onPointerMove = (e) => {
    if (!drag.current) return;
    setRotZ(drag.current.rot + (e.clientX - drag.current.x) * DRAG_PER_PX);
  };

  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    clearTimeout(quiet.current);
    settle();
  };

  // Sumbu yang dominan menang: geser dua jari mendatar di trackpad mengirim
  // deltaX, roda tetikus mengirim deltaY, dan keduanya berarti hal yang sama di
  // sini. Tanpa preventDefault — React memasang wheel sebagai passive, dan
  // cangkang overflow-hidden jadi tidak ada gulir yang perlu dicegah.
  const onWheel = (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    clearTimeout(quiet.current);
    clearTimeout(done.current);
    setSettling(false);
    setRotZ((r) => r + delta * WHEEL_PER_UNIT);
    quiet.current = setTimeout(settle, SETTLE_MS);
  };

  return {
    rotZ,
    settling,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onWheel,
    },
  };
}

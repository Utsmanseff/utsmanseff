"use client";

import { useRef, useState } from 'react';
import { snapRotation } from './layout';

// Kamera peta, dan satu-satunya tempat yang tahu bagaimana ia digerakkan.
// Ia tidak tahu apa itu warna, dan tidak tahu plate mana yang terpilih.
//
// Kontrak geraknya terbelah, seperti sisa proyek ini: selama jari menempel,
// 1:1 tanpa easing.

const DRAG_PER_PX = 0.22;
const WHEEL_PER_UNIT = 0.12;
const START_ANGLE = -40;

export function useMapCamera(initial = START_ANGLE) {
  const [rotZ, setRotZ] = useState(initial);
  const drag = useRef(null);

  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, rot: rotZ };
  };

  const onPointerMove = (e) => {
    if (!drag.current) return;
    setRotZ(drag.current.rot + (e.clientX - drag.current.x) * DRAG_PER_PX);
  };

  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    setRotZ((r) => snapRotation(r));
  };

  // Sumbu yang dominan menang: geser dua jari mendatar di trackpad mengirim
  // deltaX, roda tetikus mengirim deltaY, dan keduanya berarti hal yang sama di
  // sini. Tanpa preventDefault — React memasang wheel sebagai passive, dan
  // cangkang overflow-hidden jadi tidak ada gulir yang perlu dicegah.
  const onWheel = (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    setRotZ((r) => r + delta * WHEEL_PER_UNIT);
  };

  return {
    rotZ,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onWheel,
    },
  };
}

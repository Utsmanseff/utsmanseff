"use client";

import { useRef, useState } from 'react';
import { snapRotation } from './layout';

// Kamera peta, dan satu-satunya tempat yang tahu bagaimana ia digerakkan.
// Ia tidak tahu apa itu warna, dan tidak tahu plate mana yang terpilih.
//
// Kontrak geraknya terbelah, seperti sisa proyek ini: selama jari menempel,
// 1:1 tanpa easing.

const DRAG_PER_PX = 0.22;
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

  return {
    rotZ,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
}

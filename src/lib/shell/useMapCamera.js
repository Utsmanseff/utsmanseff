"use client";

import { useRef, useState } from 'react';

// Kamera peta, dan satu-satunya tempat yang tahu bagaimana ia digerakkan.
// Ia tidak tahu apa itu warna, dan tidak tahu plate mana yang terpilih.
//
// Kamera tidak pernah bergerak sendiri. Ia mengikuti jari 1:1 tanpa easing, dan
// berhenti persis di tempat jari melepasnya — roda maupun seret.
//
// Dulu ia menyentak ke tiga sudut tetap waktu dilepas. Utsman melihatnya
// berjalan dan menolaknya: kalau gulirannya balik lagi, gulirannya tidak ada
// gunanya. Jangan dikembalikan tanpa alasan baru.

const DRAG_PER_PX = 0.22;
const WHEEL_PER_UNIT = 0.12;
const CLICK_SLOP = 4;
const START_ANGLE = -40;

export function useMapCamera(initial = START_ANGLE) {
  const [rotZ, setRotZ] = useState(initial);
  const drag = useRef(null);
  const travelled = useRef(0);

  const onPointerDown = (e) => {
    travelled.current = 0;
    drag.current = { x: e.clientX, last: e.clientX, rot: rotZ };
  };

  const onPointerMove = (e) => {
    if (!drag.current) return;
    // Jarak yang ditempuh, bukan jarak dari titik awal: seret bolak-balik yang
    // berakhir di tempat semula tetap seret.
    travelled.current += Math.abs(e.clientX - drag.current.last);
    drag.current.last = e.clientX;
    setRotZ(drag.current.rot + (e.clientX - drag.current.x) * DRAG_PER_PX);
  };

  const endDrag = () => {
    drag.current = null;
  };

  // Sumbu yang dominan menang: geser dua jari mendatar di trackpad mengirim
  // deltaX, roda tetikus mengirim deltaY, dan keduanya berarti hal yang sama di
  // sini. Tanpa preventDefault — React memasang wheel sebagai passive, dan
  // cangkang overflow-hidden jadi tidak ada gulir yang perlu dicegah.
  const onWheel = (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    setRotZ((r) => r + delta * WHEEL_PER_UNIT);
  };

  // Dibaca oleh MapScene di onClick, yang menyala sesudah pointerup. Ref, bukan
  // state: kalau ia memicu render, angkanya sudah berubah sebelum klik sampai.
  const dragged = () => travelled.current > CLICK_SLOP;

  return {
    rotZ,
    dragged,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onWheel,
    },
  };
}

import { ImageResponse } from 'next/og';
import { meta } from '@/lib/data/meta';

export const alt = 'Utsman — Fullstack Web Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The card paints the canvas layer, because that is what a visitor lands on.
// Colours are hardcoded here: ImageResponse renders outside the Tailwind
// pipeline, so `@theme` tokens are unavailable. These are the same hexes.
const GROUND = '#161A1D';
const GROUND_INK = '#E8E0D0';
const GROUND_MUTE = '#7A8580';
const AMBER = '#C97B3F';

const host = meta.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: GROUND,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 12, height: 12, background: AMBER, borderRadius: 6 }} />
          <span
            style={{
              fontSize: 22,
              color: GROUND_MUTE,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            {host}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 160,
              color: GROUND_INK,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -6,
            }}
          >
            Utsman
          </div>
          <div style={{ display: 'flex', width: 180, height: 4, background: AMBER, marginTop: 36 }} />
          <div
            style={{
              fontSize: 36,
              color: GROUND_INK,
              fontStyle: 'italic',
              marginTop: 28,
              maxWidth: 940,
              lineHeight: 1.25,
            }}
          >
            Peta project: sistem rumah sakit dan instansi publik di Kalimantan Selatan.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 22,
            color: GROUND_MUTE,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          <span>Banjarbaru, ID</span>
          <span>Laravel · Next.js · MySQL</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

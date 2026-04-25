import { ImageResponse } from 'next/og';

export const alt = 'Utsman — Fullstack Web Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#F5F1E8',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 12, height: 12, background: '#C97B3F' }} />
          <span
            style={{
              fontSize: 22,
              color: '#6B6B5E',
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            utsman.dev
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 160,
              color: '#1F3A2E',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -6,
            }}
          >
            Utsman
          </div>
          <div
            style={{
              fontSize: 36,
              color: '#1F3A2E',
              fontStyle: 'italic',
              marginTop: 28,
              maxWidth: 940,
              lineHeight: 1.25,
            }}
          >
            Solving real problems with software that feels effortless to use.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 22,
            color: '#6B6B5E',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          <span>Banjarbaru, ID</span>
          <span>Healthtech · BPJS · OCR</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

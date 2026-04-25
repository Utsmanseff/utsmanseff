import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#1F3A2E',
          color: '#C97B3F',
          fontSize: 44,
          fontWeight: 900,
          fontFamily: 'serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: -2,
        }}
      >
        U
      </div>
    ),
    { ...size }
  );
}

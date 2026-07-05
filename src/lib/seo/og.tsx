import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

export function createOgImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: 64,
          background: '#f8fafc',
          color: '#0f172a',
        }}
      >
        <div style={{ fontSize: 28, color: '#1d4ed8', fontWeight: 600 }}>PickTheRobot</div>
        <div style={{ fontSize: 52, fontWeight: 700, marginTop: 16, lineHeight: 1.15, maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ fontSize: 22, color: '#475569', marginTop: 24, maxWidth: 900, lineHeight: 1.4 }}>
          {subtitle}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

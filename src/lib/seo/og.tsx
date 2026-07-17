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
          background: 'linear-gradient(145deg, #f0f4f8 0%, #e0f2fe 55%, #ecfeff 100%)',
          color: '#0b1220',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 26,
            color: '#0e7490',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#0e7490',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 18,
                height: 10,
                borderRadius: 4,
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                paddingLeft: 2,
                paddingRight: 2,
              }}
            >
              <div style={{ width: 3, height: 3, borderRadius: 999, background: 'white' }} />
              <div style={{ width: 3, height: 3, borderRadius: 999, background: 'white' }} />
            </div>
          </div>
          PickTheRobot
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            marginTop: 20,
            lineHeight: 1.12,
            maxWidth: 1000,
            letterSpacing: '-0.03em',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 22,
            color: '#3d4f66',
            marginTop: 24,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            marginTop: 40,
            height: 3,
            width: 120,
            background: '#0e7490',
            borderRadius: 2,
          }}
        />
      </div>
    ),
    OG_SIZE,
  );
}

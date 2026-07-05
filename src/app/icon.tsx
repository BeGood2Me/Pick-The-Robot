import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#1d4ed8',
          borderRadius: 6,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
          <circle cx="10" cy="11" r="2" fill="white" />
          <circle cx="18" cy="11" r="2" fill="white" />
          <path d="M9 17h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <rect x="12" y="4" width="4" height="3" rx="1" fill="white" opacity="0.9" />
        </svg>
      </div>
    ),
    size,
  );
}

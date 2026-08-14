import { ROBOT_MARK_COLOR } from '@/lib/brand/robotMark';

/** Shared robot mark for favicon / app icon ImageResponse routes. */
export const ROBOT_ICON_SIZES = {
  favicon: 32,
  apple: 180,
} as const;

function u(size: number, n: number) {
  return Math.round((n / 28) * size);
}

/**
 * Satori (next/og) does not reliably render nested SVG.
 * Draw the mark with flex divs so /icon actually produces a PNG.
 */
export function robotIconMarkup(size: number) {
  const eye = u(size, 4.5);
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: ROBOT_MARK_COLOR,
        borderRadius: u(size, 6),
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: u(size, 7.75),
          top: u(size, 8.75),
          width: eye,
          height: eye,
          borderRadius: eye,
          background: '#ffffff',
        }}
      />
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: u(size, 15.75),
          top: u(size, 8.75),
          width: eye,
          height: eye,
          borderRadius: eye,
          background: '#ffffff',
        }}
      />
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: u(size, 9),
          top: u(size, 16),
          width: u(size, 10),
          height: u(size, 2),
          borderRadius: u(size, 1),
          background: '#ffffff',
        }}
      />
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: u(size, 12),
          top: u(size, 4),
          width: u(size, 4),
          height: u(size, 3),
          borderRadius: u(size, 1),
          background: '#ffffff',
        }}
      />
    </div>
  );
}

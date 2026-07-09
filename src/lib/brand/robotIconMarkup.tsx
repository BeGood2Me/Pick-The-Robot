/** Shared robot mark for favicon / app icon ImageResponse routes. */
export const ROBOT_ICON_SIZES = {
  favicon: 96,
  apple: 180,
} as const;

export function robotIconMarkup(size: number) {
  const radius = Math.round(size * (6 / 28));
  const svgSize = Math.round(size * (20 / 28));

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: '#1d4ed8',
        borderRadius: radius,
      }}
    >
      <svg width={svgSize} height={svgSize} viewBox="0 0 28 28" fill="none">
        <circle cx="10" cy="11" r="2" fill="white" />
        <circle cx="18" cy="11" r="2" fill="white" />
        <path d="M9 17h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <rect x="12" y="4" width="4" height="3" rx="1" fill="white" opacity="0.9" />
      </svg>
    </div>
  );
}

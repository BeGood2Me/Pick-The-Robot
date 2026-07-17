/** Shared robot mark SVG used in header logo and generated favicons. */
export const ROBOT_MARK_COLOR = '#0e7490';

type RobotMarkSvgProps = {
  size?: number;
  className?: string;
};

export function RobotMarkSvg({ size = 28, className }: RobotMarkSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="28" height="28" rx="6" fill={ROBOT_MARK_COLOR} />
      <rect x="2" y="2" width="24" height="24" rx="4" stroke="white" strokeOpacity="0.2" />
      <circle cx="10" cy="11" r="2.25" fill="white" />
      <circle cx="18" cy="11" r="2.25" fill="white" />
      <path d="M9 17h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <rect x="12" y="4" width="4" height="3" rx="1" fill="white" opacity="0.9" />
      <circle cx="14" cy="3" r="1" fill="white" opacity="0.85" />
    </svg>
  );
}

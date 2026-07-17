import { RobotMarkSvg } from '@/lib/brand/robotMark';

/** Shared robot mark for favicon / app icon ImageResponse routes. */
export const ROBOT_ICON_SIZES = {
  favicon: 96,
  apple: 180,
} as const;

export function robotIconMarkup(size: number) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <RobotMarkSvg size={size} />
    </div>
  );
}

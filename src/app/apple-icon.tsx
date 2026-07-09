import { ImageResponse } from 'next/og';
import { ROBOT_ICON_SIZES, robotIconMarkup } from '@/lib/brand/robotIconMarkup';

export const size = { width: ROBOT_ICON_SIZES.apple, height: ROBOT_ICON_SIZES.apple };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(robotIconMarkup(ROBOT_ICON_SIZES.apple), size);
}

import { ImageResponse } from 'next/og';
import { ROBOT_ICON_SIZES, robotIconMarkup } from '@/lib/brand/robotIconMarkup';

export const size = { width: ROBOT_ICON_SIZES.favicon, height: ROBOT_ICON_SIZES.favicon };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(robotIconMarkup(ROBOT_ICON_SIZES.favicon), size);
}

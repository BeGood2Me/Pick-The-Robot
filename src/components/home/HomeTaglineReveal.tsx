import { WordColourReveal } from '@/components/originkit/text-colour-sweep';
import { HOME_TAGLINE_LINES } from '@/lib/content/home-landing';

export function HomeTaglineReveal() {
  return (
    <section
      className="mb-12 flex flex-col justify-center gap-3 py-12 sm:mb-16 sm:gap-4 sm:py-16"
      aria-label="PickTheRobot tagline"
    >
      <WordColourReveal lines={[...HOME_TAGLINE_LINES]} />
    </section>
  );
}

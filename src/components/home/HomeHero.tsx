import { HomeHeroMatchPreview } from '@/components/home/HomeHeroMatchPreview';
import { ButtonLink } from '@/components/ui/Button';
import { HOME_HERO, HOME_TRACKS } from '@/lib/content/home-landing';

export function HomeHero() {
  return (
    <section className="mb-4 border-b border-surface-border pb-4 sm:mb-10 sm:pb-10">
      <div className="grid items-center gap-4 sm:grid-cols-[1fr,min(280px,36%)] sm:gap-6 lg:gap-8">
        <div>
          <h1
            className="font-display text-2xl font-semibold leading-tight text-balance text-ink sm:text-4xl lg:text-5xl"
            style={{ maxWidth: 680 }}
          >
            {HOME_HERO.h1}
          </h1>
          <p
            className="mt-2 max-w-xl text-sm text-pretty text-ink-muted sm:mt-4 sm:text-lg"
            style={{ maxWidth: 680 }}
          >
            {HOME_HERO.subhead}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 sm:mt-6 sm:flex">
            {HOME_TRACKS.map((track) => (
              <ButtonLink
                key={track.id}
                href={track.href}
                variant="primary"
                className="text-base"
              >
                {track.cta}
              </ButtonLink>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-faint sm:mt-3 sm:text-sm">{HOME_HERO.proof}</p>
        </div>
        <HomeHeroMatchPreview className="mx-auto hidden w-full max-w-sm sm:block" />
      </div>
    </section>
  );
}

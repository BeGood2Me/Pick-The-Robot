import { HomeHeroIllustration } from '@/components/brand/HomeHeroIllustration';
import { ButtonLink } from '@/components/ui/Button';
import { HOME_HERO } from '@/lib/content/home-landing';

export function HomeHero() {
  return (
    <section className="mb-8 border-b border-surface-border pb-8 sm:mb-10 sm:pb-10">
      <div className="grid items-center gap-6 sm:grid-cols-[1fr,min(280px,36%)] lg:gap-8">
        <div>
          <h1
            className="font-display text-3xl font-semibold leading-tight text-balance text-ink sm:text-4xl lg:text-5xl"
            style={{ maxWidth: 680 }}
          >
            {HOME_HERO.h1}
          </h1>
          <p
            className="mt-4 max-w-xl text-base text-pretty text-ink-muted sm:text-lg"
            style={{ maxWidth: 680 }}
          >
            {HOME_HERO.subhead}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <ButtonLink href={HOME_HERO.ctaHref} variant="primary" className="text-base">
              {HOME_HERO.ctaLabel}
            </ButtonLink>
            <p className="text-sm text-ink-faint">{HOME_HERO.proof}</p>
          </div>
        </div>
        <HomeHeroIllustration className="mx-auto hidden w-full max-w-[240px] sm:block lg:max-w-sm" />
      </div>
    </section>
  );
}

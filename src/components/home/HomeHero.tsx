import { HomeHeroIllustration } from '@/components/brand/HomeHeroIllustration';
import { ButtonLink } from '@/components/ui/Button';
import { HOME_HERO } from '@/lib/content/home-landing';

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
          <div className="mt-3 hidden flex-wrap items-center gap-4 sm:mt-6 sm:flex">
            <ButtonLink href={HOME_HERO.ctaHref} variant="primary" className="text-base">
              {HOME_HERO.ctaLabel}
            </ButtonLink>
            <p className="text-sm text-ink-faint">{HOME_HERO.proof}</p>
          </div>
          <p className="mt-2 text-xs text-ink-faint sm:hidden">{HOME_HERO.proof}</p>
        </div>
        <HomeHeroIllustration className="mx-auto hidden w-full max-w-[240px] sm:block lg:max-w-sm" />
      </div>
    </section>
  );
}

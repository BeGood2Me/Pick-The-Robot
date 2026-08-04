import { ButtonLink } from '@/components/ui/Button';
import { HOME_FINAL_CTA } from '@/lib/content/home-landing';

export function HomeFinalCta() {
  return (
    <section className="mb-4 card border-accent/30 bg-accent-soft/20 sm:mb-6">
      <h2 className="font-display text-2xl font-semibold text-ink">{HOME_FINAL_CTA.title}</h2>
      <p className="mt-2 text-base text-pretty text-ink-muted">{HOME_FINAL_CTA.body}</p>
      <p className="mt-6">
        <ButtonLink href={HOME_FINAL_CTA.ctaHref} variant="primary" className="text-base">
          {HOME_FINAL_CTA.ctaLabel}
        </ButtonLink>
      </p>
    </section>
  );
}

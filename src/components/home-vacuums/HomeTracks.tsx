import { ButtonLink } from '@/components/ui/Button';
import { HOME_TRACKS } from '@/lib/content/home-landing';

export function HomeTracks() {
  return (
    <section id="tracks" className="mb-12 scroll-mt-24 sm:mb-16 sm:scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Choose a track</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted sm:text-base">
        Home robots and business robots are scored separately. Pick the job you have — not a blended
        wizard.
      </p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {HOME_TRACKS.map((track) => (
          <article
            key={track.id}
            className="flex flex-col rounded-xl border-2 border-surface-border bg-surface p-5 shadow-sm sm:p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">{track.eyebrow}</p>
            <h3 className="mt-2 font-display text-xl font-semibold text-ink sm:text-2xl">{track.title}</h3>
            <p className="mt-2 flex-1 text-sm text-pretty text-ink-muted">{track.body}</p>
            <p className="mt-5">
              <ButtonLink href={track.href} variant="primary" className="text-base">
                {track.cta}
              </ButtonLink>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

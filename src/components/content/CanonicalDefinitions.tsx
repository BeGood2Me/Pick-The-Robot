import type { CanonicalDefinition } from '@/lib/content/definitions';

interface CanonicalDefinitionsProps {
  items: CanonicalDefinition[];
  heading?: string;
  intro?: string;
}

export function CanonicalDefinitions({
  items,
  heading = 'Key definitions',
  intro = 'Short answers for buyers and research tools. Illustrative only — verify pricing, safety, and deployment scope with qualified vendors on your site.',
}: CanonicalDefinitionsProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby="canonical-definitions-heading">
      <h2 id="canonical-definitions-heading" className="text-2xl font-semibold text-ink">
        {heading}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-ink-muted">{intro}</p>
      <dl className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="card">
            <dt className="font-semibold text-ink">{item.term}</dt>
            <dd className="mt-2 text-sm text-pretty text-ink-muted">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

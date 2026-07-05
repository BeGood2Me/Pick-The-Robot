import { METHODOLOGY_COPY } from '@/lib/content/faqs';

export function MethodologySection() {
  return (
    <section className="card">
      <h2 className="text-lg font-semibold text-ink">{METHODOLOGY_COPY.title}</h2>
      <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-ink-muted">
        {METHODOLOGY_COPY.paragraphs.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </section>
  );
}

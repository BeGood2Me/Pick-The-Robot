import Link from 'next/link';
import { METHODOLOGY_COPY } from '@/lib/content/faqs';
import { METHODOLOGY_PATH } from '@/lib/content/methodology';

export function MethodologySection() {
  return (
    <section className="card">
      <h2 className="text-lg font-semibold text-ink">{METHODOLOGY_COPY.title}</h2>
      <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-ink-muted">
        {METHODOLOGY_COPY.paragraphs.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <Link href={METHODOLOGY_PATH} className="font-medium text-accent hover:underline">
          Full methodology — scoring, sponsorship, and limits
        </Link>
      </p>
    </section>
  );
}

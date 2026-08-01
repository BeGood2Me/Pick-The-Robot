import type { FaqItem } from '@/lib/seo/schema';

export function FaqBlock({
  items,
  title = 'FAQ',
  defaultOpen = 0,
}: {
  items: FaqItem[];
  title?: string;
  defaultOpen?: number | null;
}) {
  return (
    <section className="card">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 divide-y divide-surface-border">
        {items.map((item, i) => (
          <details
            key={item.question}
            className="group py-3"
            {...(defaultOpen === i ? { open: true } : {})}
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              <span>{item.question}</span>
              <span
                aria-hidden
                className="inline-block w-4 shrink-0 text-center text-ink-faint after:content-['+'] group-open:after:content-['−']"
              />
            </summary>
            <p className="mt-2 text-sm text-ink-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

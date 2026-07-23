import Link from 'next/link';
import type { ReactNode } from 'react';
import { PrintChecklistButton } from '@/components/blog/PrintChecklistButton';
import type { BuyersChecklistItem } from '@/lib/content/buyers-checklist-types';

interface BuyersChecklistProps {
  id: string;
  heading: string;
  intro: string;
  items: BuyersChecklistItem[];
  decisionTree: ReactNode;
  vendorQuestions: string[];
  printSubtitle: string;
  printFooterUrl: string;
}

export function BuyersChecklist({
  id,
  heading,
  intro,
  items,
  decisionTree,
  vendorQuestions,
  printSubtitle,
  printFooterUrl,
}: BuyersChecklistProps) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="print-checklist-root mt-10 scroll-mt-24">
      <div className="print-only print-header mb-4 hidden">
        <p className="text-lg font-bold text-ink">PickTheRobot</p>
        <p className="text-sm text-ink-muted">{printSubtitle}</p>
      </div>

      <div className="card border-accent/30 bg-accent-soft/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id={headingId} className="text-xl font-semibold text-ink">
              {heading}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">{intro}</p>
          </div>
          <div className="no-print shrink-0">
            <PrintChecklistButton />
          </div>
        </div>

        <ol className="mt-6 space-y-4">
          {items.map((item) => (
            <li
              key={item.step}
              className="flex gap-3 rounded-lg border border-surface-border bg-surface p-4 print:break-inside-avoid"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white"
                aria-hidden
              >
                {item.step}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-sm text-ink-muted">{item.summary}</p>
                <p className="mt-2 text-sm">
                  <Link href={item.href} className="font-medium text-accent hover:underline">
                    {item.linkLabel}
                  </Link>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 card">
        <h3 className="text-lg font-semibold text-ink">Quick decision tree</h3>
        <p className="mt-2 text-sm text-ink-muted">
          A starting point before vendor demos — validate with the matcher and a site walkthrough.
        </p>
        <div className="mt-4 space-y-3 text-sm text-ink-muted">{decisionTree}</div>
      </div>

      <div className="mt-6 card">
        <h3 className="text-lg font-semibold text-ink">Questions to ask vendors on the first call</h3>
        <p className="mt-2 text-sm text-ink-muted">
          Copy these into your RFP or discovery notes — they surface fit, mapping, and total cost early.
        </p>
        <ul className="mt-4 list-inside list-decimal space-y-2 text-sm text-ink-muted">
          {vendorQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </div>

      <div className="print-only print-footer mt-6 hidden text-xs text-ink-muted">
        <p>
          Free buyer-side matcher — warehouse, cleaning, and restaurant robots. Verify all pricing and
          deployment scope with vendors directly.
        </p>
        <p className="mt-1">{printFooterUrl}</p>
      </div>
    </section>
  );
}

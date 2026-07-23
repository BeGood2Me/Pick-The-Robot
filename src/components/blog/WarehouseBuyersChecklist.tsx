import Link from 'next/link';
import { PrintChecklistButton } from '@/components/blog/PrintChecklistButton';
import {
  VENDOR_FIRST_CALL_QUESTIONS,
  WAREHOUSE_BUYERS_CHECKLIST,
} from '@/lib/content/warehouse-buyers-checklist';

export function WarehouseBuyersChecklist() {
  return (
    <section
      id="warehouse-buyers-checklist"
      aria-labelledby="warehouse-checklist-heading"
      className="print-checklist-root mt-10 scroll-mt-24"
    >
      <div className="print-only print-header mb-4 hidden">
        <p className="text-lg font-bold text-ink">PickTheRobot</p>
        <p className="text-sm text-ink-muted">Warehouse robot buyer&apos;s checklist · picktherobot.com</p>
      </div>

      <div className="card border-accent/30 bg-accent-soft/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="warehouse-checklist-heading" className="text-xl font-semibold text-ink">
              Warehouse robot buyer&apos;s checklist
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">
              Use this before vendor demos. Each step links to a deeper guide on PickTheRobot — print or
              share this page with your ops and procurement team.
            </p>
          </div>
          <div className="no-print shrink-0">
            <PrintChecklistButton />
          </div>
        </div>

        <ol className="mt-6 space-y-4">
          {WAREHOUSE_BUYERS_CHECKLIST.map((item) => (
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
          A starting point before you call sales — validate with the matcher and vendor site visits.
        </p>
        <div className="mt-4 space-y-3 text-sm text-ink-muted">
          <p>
            <strong className="text-ink">Layout changes frequently?</strong>{' '}
            → Often <Link href="/amr-vs-agv" className="text-accent hover:underline">AMR</Link> for
            dynamic transport
          </p>
          <p>
            <strong className="text-ink">Fixed, repetitive pallet lane?</strong> → Often{' '}
            <Link href="/amr-vs-agv" className="text-accent hover:underline">AGV or pallet mover</Link>
          </p>
          <p>
            <strong className="text-ink">Picking / walking is the bottleneck?</strong> → Consider{' '}
            <Link href="/best/picking_assist/ecommerce-warehouse" className="text-accent hover:underline">
              pick-assist
            </Link>
          </p>
          <p>
            <strong className="text-ink">Unproven utilization or tight capex?</strong> → Pilot with{' '}
            <Link href="/robotics-as-a-service" className="text-accent hover:underline">RaaS</Link> first
          </p>
        </div>
      </div>

      <div className="mt-6 card">
        <h3 className="text-lg font-semibold text-ink">Questions to ask vendors on the first call</h3>
        <p className="mt-2 text-sm text-ink-muted">
          Copy these into your RFP or discovery notes — they surface fit, integration, and total cost early.
        </p>
        <ul className="mt-4 list-inside list-decimal space-y-2 text-sm text-ink-muted">
          {VENDOR_FIRST_CALL_QUESTIONS.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </div>

      <div className="print-only print-footer mt-6 hidden text-xs text-ink-muted">
        <p>
          Free buyer-side matcher — warehouse, cleaning, and restaurant robots. Verify all pricing and
          deployment scope with vendors directly.
        </p>
        <p className="mt-1">https://picktherobot.com/blog/how-to-buy-warehouse-robot</p>
      </div>
    </section>
  );
}

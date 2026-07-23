import Link from 'next/link';
import { BuyersChecklist } from '@/components/content/BuyersChecklist';
import {
  VENDOR_FIRST_CALL_QUESTIONS,
  WAREHOUSE_BUYERS_CHECKLIST,
} from '@/lib/content/warehouse-buyers-checklist';

export function WarehouseBuyersChecklist() {
  return (
    <BuyersChecklist
      id="warehouse-buyers-checklist"
      heading="Warehouse robot buyer's checklist"
      intro="Use this before vendor demos. Each step links to a deeper guide on PickTheRobot — print or share this page with your ops and procurement team."
      items={WAREHOUSE_BUYERS_CHECKLIST}
      decisionTree={
        <>
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
        </>
      }
      vendorQuestions={VENDOR_FIRST_CALL_QUESTIONS}
      printSubtitle="Warehouse robot buyer's checklist · picktherobot.com"
      printFooterUrl="https://picktherobot.com/blog/how-to-buy-warehouse-robot#warehouse-buyers-checklist"
    />
  );
}

import Link from 'next/link';
import { BuyersChecklist } from '@/components/content/BuyersChecklist';
import {
  WAREHOUSE_BUYERS_CHECKLIST,
  WAREHOUSE_BUYERS_CHECKLIST_PATH,
  WAREHOUSE_VENDOR_FIRST_CALL_QUESTIONS,
} from '@/lib/content/warehouse-buyers-checklist';
import { BASE_URL } from '@/lib/seo/metadata';

export function WarehouseBuyersChecklist() {
  return (
    <BuyersChecklist
      id="warehouse-buyers-checklist"
      heading="Warehouse robot buyer checklist"
      intro="Use this before vendor demos. Each step links to a deeper guide on PickTheRobot — print or share with ops and procurement."
      items={WAREHOUSE_BUYERS_CHECKLIST}
      decisionTree={
        <>
          <p>
            <strong className="text-ink">Layout changes frequently?</strong> → Often{' '}
            <Link href="/amr-vs-agv" className="text-accent hover:underline">
              AMR
            </Link>{' '}
            for dynamic transport
          </p>
          <p>
            <strong className="text-ink">Fixed, repetitive pallet lane?</strong> → Often{' '}
            <Link href="/amr-vs-agv" className="text-accent hover:underline">
              AGV or pallet mover
            </Link>
          </p>
          <p>
            <strong className="text-ink">Picking / walking is the bottleneck?</strong> → Consider{' '}
            <Link href="/best/picking_assist/ecommerce-warehouse" className="text-accent hover:underline">
              pick-assist
            </Link>
          </p>
          <p>
            <strong className="text-ink">Unproven utilization or tight capex?</strong> → Pilot with{' '}
            <Link href="/robotics-as-a-service" className="text-accent hover:underline">
              RaaS
            </Link>{' '}
            first
          </p>
        </>
      }
      vendorQuestions={WAREHOUSE_VENDOR_FIRST_CALL_QUESTIONS}
      printSubtitle="Warehouse robot buyer checklist · picktherobot.com"
      printFooterUrl={`${BASE_URL}${WAREHOUSE_BUYERS_CHECKLIST_PATH}`}
    />
  );
}

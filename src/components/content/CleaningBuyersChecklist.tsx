import Link from 'next/link';
import { BuyersChecklist } from '@/components/content/BuyersChecklist';
import {
  CLEANING_BUYERS_CHECKLIST,
  CLEANING_VENDOR_FIRST_CALL_QUESTIONS,
} from '@/lib/content/cleaning-buyers-checklist';

export function CleaningBuyersChecklist() {
  return (
    <BuyersChecklist
      id="cleaning-buyers-checklist"
      heading="Commercial cleaning robot buyer's checklist"
      intro="Use this before vendor demos. Each step links to a deeper guide on PickTheRobot — print or share with facilities and procurement."
      items={CLEANING_BUYERS_CHECKLIST}
      decisionTree={
        <>
          <p>
            <strong className="text-ink">Daily cleaning across 1,500+ m² / 16k+ sq ft?</strong> → Often worth{' '}
            <Link href="/cleaning-robot-vs-cleaning-staff" className="text-accent hover:underline">
              evaluating a robot
            </Link>
          </p>
          <p>
            <strong className="text-ink">Small office, weekly light clean?</strong> →{' '}
            <Link href="/cleaning-robot-vs-cleaning-staff" className="text-accent hover:underline">
              Staff may fit better
            </Link>{' '}
            until scale grows
          </p>
          <p>
            <strong className="text-ink">Office or retail floors?</strong> → Start with{' '}
            <Link href="/best/office_cleaner/office-retail-floors" className="text-accent hover:underline">
              compact autonomous cleaners
            </Link>
          </p>
          <p>
            <strong className="text-ink">Unproven utilization or tight capex?</strong> → Pilot with{' '}
            <Link href="/cleaning-robots-as-a-service" className="text-accent hover:underline">
              cleaning RaaS
            </Link>{' '}
            first
          </p>
        </>
      }
      vendorQuestions={CLEANING_VENDOR_FIRST_CALL_QUESTIONS}
      printSubtitle="Commercial cleaning robot buyer's checklist · picktherobot.com"
      printFooterUrl="https://picktherobot.com/cleaning-robot-vs-cleaning-staff#cleaning-buyers-checklist"
    />
  );
}

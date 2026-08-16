import Link from 'next/link';
import { BuyersChecklist } from '@/components/content/BuyersChecklist';
import {
  RESTAURANT_BUYERS_CHECKLIST,
  RESTAURANT_BUYERS_CHECKLIST_PATH,
  RESTAURANT_VENDOR_FIRST_CALL_QUESTIONS,
} from '@/lib/content/restaurant-buyers-checklist';
import { BASE_URL } from '@/lib/seo/metadata';

export function RestaurantBuyersChecklist() {
  return (
    <BuyersChecklist
      id="restaurant-buyers-checklist"
      heading="Restaurant robot buyer's checklist"
      intro="Use this before vendor demos. Each step links to a deeper guide on PickTheRobot — print or share with ops and ownership."
      items={RESTAURANT_BUYERS_CHECKLIST}
      decisionTree={
        <>
          <p>
            <strong className="text-ink">High peak covers + open aisles?</strong> → Often worth{' '}
            <Link href="/restaurant-robot-vs-runner" className="text-accent hover:underline">
              evaluating a serving robot
            </Link>
          </p>
          <p>
            <strong className="text-ink">Buffet or high table turnover?</strong> → Consider{' '}
            <Link href="/restaurant-robots#guide" className="text-accent hover:underline">
              bussing robots
            </Link>
          </p>
          <p>
            <strong className="text-ink">Back-of-house bottleneck at one station?</strong> → Look at{' '}
            <Link href="/restaurant-robots#guide" className="text-accent hover:underline">
              kitchen automation
            </Link>{' '}
            for that station first
          </p>
          <p>
            <strong className="text-ink">Narrow fine-dining layout?</strong> →{' '}
            <Link href="/restaurant-robot-vs-runner" className="text-accent hover:underline">
              Staff may fit better
            </Link>{' '}
            until paths are workable
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
      vendorQuestions={RESTAURANT_VENDOR_FIRST_CALL_QUESTIONS}
      printSubtitle="Restaurant robot buyer's checklist · picktherobot.com"
      printFooterUrl={`${BASE_URL}${RESTAURANT_BUYERS_CHECKLIST_PATH}`}
    />
  );
}

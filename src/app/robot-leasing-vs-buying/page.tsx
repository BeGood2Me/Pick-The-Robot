import { LeaseVsBuyPage, decisionMetadata } from '@/components/pages/DecisionPage';

export const metadata = decisionMetadata('robot-leasing-vs-buying');

export default function Page() {
  return <LeaseVsBuyPage />;
}

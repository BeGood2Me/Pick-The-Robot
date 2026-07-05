import { CategoryPage, categoryMetadata } from '@/components/pages/CategoryPage';

export const metadata = categoryMetadata('cleaning');

export default function CleaningRobotsPage() {
  return <CategoryPage category="cleaning" />;
}

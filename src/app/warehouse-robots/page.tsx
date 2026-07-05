import { CategoryPage, categoryMetadata } from '@/components/pages/CategoryPage';

export const metadata = categoryMetadata('warehouse');

export default function WarehouseRobotsPage() {
  return <CategoryPage category="warehouse" />;
}

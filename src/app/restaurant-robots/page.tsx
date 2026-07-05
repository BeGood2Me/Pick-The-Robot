import { CategoryPage, categoryMetadata } from '@/components/pages/CategoryPage';

export const metadata = categoryMetadata('restaurant');

export default function RestaurantRobotsPage() {
  return <CategoryPage category="restaurant" />;
}

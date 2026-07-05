import { redirect } from 'next/navigation';
import { CATEGORY_ROUTES } from '@/lib/content/navigation';
import type { RobotCategory } from '@/lib/matching';

const VALID: RobotCategory[] = ['warehouse', 'cleaning', 'restaurant'];

export default async function LegacyMatchRedirect({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (VALID.includes(category as RobotCategory)) {
    redirect(CATEGORY_ROUTES[category as RobotCategory]);
  }
  redirect('/');
}

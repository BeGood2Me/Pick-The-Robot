import { notFound } from 'next/navigation';
import { BestForPage, bestForMetadata } from '@/components/pages/BestForPage';
import {
  getPublishableCombos,
  resolveBestForPage,
} from '@/lib/content/pseo';
import type { RobotType } from '@/lib/matching';

export function generateStaticParams() {
  return getPublishableCombos().map((combo) => ({
    robotType: combo.robotType,
    environment: combo.environmentId,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ robotType: string; environment: string }>;
}) {
  const { robotType, environment } = await params;
  const page = resolveBestForPage(robotType as RobotType, environment);
  if (!page) return {};
  return bestForMetadata(page);
}

export default async function BestForRoutePage({
  params,
}: {
  params: Promise<{ robotType: string; environment: string }>;
}) {
  const { robotType, environment } = await params;
  const page = resolveBestForPage(robotType as RobotType, environment);
  if (!page) notFound();
  return <BestForPage page={page} />;
}

import { notFound } from 'next/navigation';
import {
  IntegrationPage,
  integrationMetadata,
} from '@/components/pages/IntegrationPage';
import {
  getPublishableIntegrationCombos,
  resolveIntegrationPage,
} from '@/lib/content/pseo-integrations';

export function generateStaticParams() {
  return getPublishableIntegrationCombos().map((combo) => ({
    vendorSlug: combo.vendorSlug,
    softwareSlug: combo.softwareId,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vendorSlug: string; softwareSlug: string }>;
}) {
  const { vendorSlug, softwareSlug } = await params;
  const page = resolveIntegrationPage(vendorSlug, softwareSlug);
  if (!page) return {};
  return integrationMetadata(page);
}

export default async function IntegrationRoutePage({
  params,
}: {
  params: Promise<{ vendorSlug: string; softwareSlug: string }>;
}) {
  const { vendorSlug, softwareSlug } = await params;
  const page = resolveIntegrationPage(vendorSlug, softwareSlug);
  if (!page) notFound();
  return <IntegrationPage page={page} />;
}

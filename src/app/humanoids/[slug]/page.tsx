import { notFound } from 'next/navigation';
import {
  HumanoidProfilePage,
  humanoidProfileMetadata,
} from '@/components/pages/HumanoidProfilePage';
import { getAllHumanoids } from '@/lib/content/humanoids';

export function generateStaticParams() {
  return getAllHumanoids().map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return humanoidProfileMetadata(slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getAllHumanoids().some((h) => h.slug === slug)) notFound();
  return <HumanoidProfilePage slug={slug} />;
}

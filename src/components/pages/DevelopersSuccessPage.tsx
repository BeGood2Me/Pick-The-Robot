import Link from 'next/link';
import { ApiKeyReveal } from '@/components/developers/ApiKeyReveal';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { DEVELOPERS_PATH } from '@/lib/content/developers';
import { breadcrumbJsonLd } from '@/lib/seo/schema';
import { JsonLd } from '@/lib/seo/jsonld';

interface DevelopersSuccessPageProps {
  searchParams?: Promise<{ session_id?: string }>;
}

export async function DevelopersSuccessPage({ searchParams }: DevelopersSuccessPageProps) {
  const params = searchParams ? await searchParams : {};
  const sessionId = params.session_id;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Developers', path: DEVELOPERS_PATH },
          { name: 'Success', path: `${DEVELOPERS_PATH}/success` },
        ])}
      />

      <div className="container-page py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Developers', href: DEVELOPERS_PATH },
            { label: 'Success' },
          ]}
        />

        <h1 className="font-display text-4xl font-semibold">You&apos;re in</h1>
        <p className="mt-4 max-w-2xl text-lg prose-muted">
          Payment confirmed. Copy your API key below, then save your recovery link in case you need
          a new key later.
        </p>

        <div className="mt-8 max-w-2xl">
          {sessionId ? (
            <ApiKeyReveal sessionId={sessionId} />
          ) : (
            <div className="card">
              <p className="text-sm text-ink-muted">
                Missing checkout session. Return to{' '}
                <Link href={DEVELOPERS_PATH} className="text-accent hover:underline">
                  Developers
                </Link>{' '}
                to start checkout again.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

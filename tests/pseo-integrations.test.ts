import { describe, it, expect } from 'vitest';
import {
  MIN_INTEGRATION_FAQS,
  MIN_SETUP_STEPS,
  comboPassesThinGate,
  getAllIntegrationCombos,
  getIntegrationHubEntries,
  getPublishableIntegrationCombos,
  getRelatedIntegrationsForBestPage,
  integrationPath,
  resolveIntegrationPage,
} from '../src/lib/content/pseo-integrations';
import { getVendorBySlug } from '../src/lib/matching/vendors';

describe('pSEO integration pages', () => {
  it('allowlists only combos that clear the thin-page gate', () => {
    const all = getAllIntegrationCombos();
    const publishable = getPublishableIntegrationCombos();
    expect(all.length).toBeGreaterThanOrEqual(4);
    expect(publishable.length).toBeGreaterThanOrEqual(4);
    expect(publishable.every(comboPassesThinGate)).toBe(true);
  });

  it('requires summary, setup steps, and FAQs', () => {
    const thin = {
      vendorSlug: 'locus-robotics',
      softwareId: 'sap-ewm',
      environmentIds: ['ecommerce-warehouse'],
      summary: '',
      architectureNotes: ['a'],
      setupSteps: ['one', 'two'],
      faqs: [{ question: 'q', answer: 'a' }],
    };
    expect(comboPassesThinGate(thin)).toBe(false);

    const ok = {
      ...thin,
      summary: 'Enough copy for a page.',
      setupSteps: Array.from({ length: MIN_SETUP_STEPS }, (_, i) => `Step ${i + 1}`),
      faqs: Array.from({ length: MIN_INTEGRATION_FAQS }, (_, i) => ({
        question: `Q${i}`,
        answer: `A${i}`,
      })),
    };
    expect(comboPassesThinGate(ok)).toBe(true);
  });

  it('resolves Locus × SAP EWM', () => {
    const page = resolveIntegrationPage('locus-robotics', 'sap-ewm');
    expect(page).not.toBeNull();
    expect(page!.path).toBe('/integrations/locus-robotics/sap-ewm');
    expect(page!.h1.toLowerCase()).toContain('locus');
    expect(page!.h1.toLowerCase()).toContain('sap');
    expect(page!.vendor.slug).toBe('locus-robotics');
    expect(page!.software.id).toBe('sap-ewm');
    expect(page!.matcherHref).toContain('#matcher');
    expect(page!.combo.setupSteps.length).toBeGreaterThanOrEqual(MIN_SETUP_STEPS);
    expect(page!.combo.faqs.length).toBeGreaterThanOrEqual(MIN_INTEGRATION_FAQS);
    expect(page!.showAffiliateCta).toBe(false);
  });

  it('rejects unknown or unresolved pairs', () => {
    expect(resolveIntegrationPage('no-vendor', 'sap-ewm')).toBeNull();
    expect(resolveIntegrationPage('locus-robotics', 'no-software')).toBeNull();
  });

  it('static params cover publishable combos only', () => {
    const params = getPublishableIntegrationCombos().map((combo) => ({
      vendorSlug: combo.vendorSlug,
      softwareSlug: combo.softwareId,
    }));
    expect(params.length).toBe(getIntegrationHubEntries().length);
    for (const p of params) {
      expect(getVendorBySlug(p.vendorSlug)).toBeDefined();
      expect(resolveIntegrationPage(p.vendorSlug, p.softwareSlug)).not.toBeNull();
      expect(integrationPath(p.vendorSlug, p.softwareSlug)).toBe(
        `/integrations/${p.vendorSlug}/${p.softwareSlug}`,
      );
    }
  });

  it('related integrations for best pages share env + vendor', () => {
    const related = getRelatedIntegrationsForBestPage('ecommerce-warehouse', [
      'locus-robotics',
      'mir-mobile-industrial-robots',
    ]);
    expect(related.length).toBeGreaterThanOrEqual(2);
    expect(
      related.every(
        (p) =>
          p.combo.environmentIds.includes('ecommerce-warehouse') &&
          (p.vendor.slug === 'locus-robotics' ||
            p.vendor.slug === 'mir-mobile-industrial-robots'),
      ),
    ).toBe(true);
  });
});

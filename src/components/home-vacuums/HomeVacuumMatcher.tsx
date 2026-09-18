'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { MatcherSkeleton } from '@/components/matching/MatcherSkeleton';
import { HomeVacuumQuestionFlow } from '@/components/home-vacuums/HomeVacuumQuestionFlow';
import { HomeVacuumResults } from '@/components/home-vacuums/HomeVacuumResults';
import { HomeVacuumShareButton } from '@/components/home-vacuums/HomeVacuumShareButton';
import { BUSINESS_HUB_PATH } from '@/lib/content/home-vacuums';
import {
  emptyHomeVacuumAnswers,
  getHomeVacuumFieldErrors,
  HOME_VACUUM_FIELD_GROUPS,
  isCompleteHomeVacuumAnswers,
  recommendHomeVacuum,
} from '@/lib/home-vacuums';
import { decodeHomeVacuumSharePayload } from '@/lib/home-vacuums/share';
import type { HomeVacuumAnswers, HomeVacuumRecommendation, WizardHomeVacuumAnswers } from '@/lib/home-vacuums/types';

function scrollPageToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}

export type HomeVacuumMatcherPhase = 'questions' | 'results';

export function HomeVacuumMatcher({
  onPhaseChange,
}: {
  onPhaseChange?: (phase: HomeVacuumMatcherPhase) => void;
}) {
  const searchParams = useSearchParams();
  const shareToken = searchParams.get('share');

  const [answers, setAnswers] = useState<WizardHomeVacuumAnswers>(emptyHomeVacuumAnswers);
  const [result, setResult] = useState<HomeVacuumRecommendation | null>(null);
  const [questionStep, setQuestionStep] = useState(0);
  const [phase, setPhase] = useState<HomeVacuumMatcherPhase>('questions');
  const [error, setError] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(Boolean(shareToken));
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  const runMatch = useCallback((complete: HomeVacuumAnswers) => {
    const next = recommendHomeVacuum(complete);
    setResult(next);
    setPhase('results');
    setAnswers(complete);
  }, []);

  useEffect(() => {
    if (!shareToken) {
      setShareLoading(false);
      return;
    }
    const payload = decodeHomeVacuumSharePayload(shareToken);
    if (!payload) {
      setError('That share link is invalid or incomplete.');
      setShareLoading(false);
      return;
    }
    runMatch(payload.answers);
    setShareLoading(false);
  }, [shareToken, runMatch]);

  const fieldGroup = HOME_VACUUM_FIELD_GROUPS[questionStep];
  const totalSteps = HOME_VACUUM_FIELD_GROUPS.length;
  const isLastQuestionStep = questionStep >= totalSteps - 1;

  const fieldErrors = useMemo(() => {
    if (!fieldGroup || !showFieldErrors) return {};
    return getHomeVacuumFieldErrors(
      answers,
      fieldGroup.fields.map((field) => field.key),
    );
  }, [answers, fieldGroup, showFieldErrors]);

  function handleChange(key: keyof WizardHomeVacuumAnswers, value: string | boolean) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function handleNext() {
    if (!fieldGroup) return;
    const stepErrors = getHomeVacuumFieldErrors(
      answers,
      fieldGroup.fields.map((field) => field.key),
    );
    if (Object.keys(stepErrors).length > 0) {
      setShowFieldErrors(true);
      return;
    }
    setShowFieldErrors(false);
    setError(null);
    setQuestionStep((step) => step + 1);
    requestAnimationFrame(scrollPageToTop);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const allErrors = getHomeVacuumFieldErrors(answers);
    if (Object.keys(allErrors).length > 0) {
      setShowFieldErrors(true);
      setError('Answer every question to get a match.');
      return;
    }
    if (!isCompleteHomeVacuumAnswers(answers)) return;
    setError(null);
    runMatch(answers);
    requestAnimationFrame(scrollPageToTop);
  }

  function handleBack() {
    if (questionStep > 0) {
      setQuestionStep((step) => step - 1);
      setShowFieldErrors(false);
      setError(null);
      requestAnimationFrame(scrollPageToTop);
    }
  }

  function handleReset() {
    setResult(null);
    setPhase('questions');
    setQuestionStep(0);
    setShowFieldErrors(false);
    setError(null);
  }

  function handleStartOver() {
    setAnswers(emptyHomeVacuumAnswers());
    handleReset();
  }

  if (shareLoading) {
    return <MatcherSkeleton />;
  }

  if (phase === 'results' && result && isCompleteHomeVacuumAnswers(answers)) {
    return (
      <div className="space-y-6">
        <div className="no-print flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={handleReset}>
            Edit answers
          </Button>
          <HomeVacuumShareButton answers={answers} />
          <Button type="button" variant="secondary" onClick={handleStartOver}>
            Start over
          </Button>
        </div>
        <HomeVacuumResults result={result} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      {fieldGroup && (
        <form id="home-vacuum-questions" onSubmit={handleSubmit} className="scroll-mt-8">
          <div className="mb-4 flex items-center justify-between gap-4 text-sm">
            <span className="font-medium text-ink">
              Step {questionStep + 1} of {totalSteps}
            </span>
            <div
              className="flex h-2 max-w-xs flex-1 gap-1"
              role="progressbar"
              aria-valuenow={questionStep + 1}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label="Question progress"
            >
              {HOME_VACUUM_FIELD_GROUPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-full flex-1 rounded-full ${index <= questionStep ? 'bg-accent' : 'bg-surface-border'}`}
                />
              ))}
            </div>
          </div>

          <h2 className="mb-1 text-base font-semibold">{fieldGroup.title}</h2>
          {fieldGroup.description && (
            <p className="mb-4 text-sm text-ink-muted">{fieldGroup.description}</p>
          )}

          <HomeVacuumQuestionFlow
            groups={[fieldGroup]}
            answers={answers}
            onChange={handleChange}
            fieldErrors={fieldErrors}
          />

          <div className="mt-6 flex flex-wrap gap-3">
            {questionStep > 0 && (
              <Button type="button" variant="secondary" onClick={handleBack}>
                Back
              </Button>
            )}
            {isLastQuestionStep ? (
              <Button type="submit">Get recommendation</Button>
            ) : (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </form>
      )}

      <p className="text-xs text-ink-faint">
        Need a commercial floor scrubber or warehouse AMR?{' '}
        <a href={BUSINESS_HUB_PATH} className="font-medium text-accent hover:underline">
          Use the business matcher
        </a>
        .
      </p>
    </div>
  );
}

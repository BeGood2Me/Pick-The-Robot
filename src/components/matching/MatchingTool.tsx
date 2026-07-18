'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StepIcon } from '@/components/brand/StepIcon';
import { Button } from '@/components/ui/Button';
import { CategorySelector } from '@/components/matching/CategorySelector';
import { CopyResultsSummaryButton } from '@/components/matching/CopyResultsSummaryButton';
import { DownloadSummaryButton } from '@/components/matching/DownloadSummaryButton';
import { EmailResultsButton } from '@/components/matching/EmailResultsButton';
import { SavePdfButton } from '@/components/matching/SavePdfButton';
import { MatchResults } from '@/components/matching/MatchResults';
import { MatcherSkeleton } from '@/components/matching/MatcherSkeleton';
import { QuestionFlow } from '@/components/matching/QuestionFlow';
import { ShareResultsButton } from '@/components/matching/ShareResultsButton';
import { buildUserProfile, getFormFieldGroups } from '@/lib/forms';
import { clearDraft, loadDraft, saveDraft } from '@/lib/forms/draft';
import { emptyAnswersForCategory } from '@/lib/forms/defaults';
import type { FormAnswers, WizardAnswers } from '@/lib/forms/types';
import {
  getFieldErrors,
  getRequiredFieldErrors,
  validateFormAnswers,
} from '@/lib/forms/validateAnswers';
import { CATEGORY_ROUTES } from '@/lib/content/navigation';
import { detectRegionFromBrowser } from '@/lib/geo/region';
import { onFormSubmit, type RecommendationResult, type RobotCategory } from '@/lib/matching';
import { decodeSharePayload } from '@/lib/matching/share';

function initialAnswers(category: RobotCategory): WizardAnswers {
  const base = emptyAnswersForCategory(category);
  if (typeof window !== 'undefined') {
    return { ...base, region: detectRegionFromBrowser() };
  }
  return base;
}

type Phase = 'category' | 'questions' | 'results';

export function MatchingTool({
  initialCategory = null,
}: {
  initialCategory?: RobotCategory | null;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shareToken = searchParams.get('share');
  const matcherReset = searchParams.get('matcher');

  const [category, setCategory] = useState<RobotCategory | null>(initialCategory);
  const [answers, setAnswers] = useState<WizardAnswers | null>(
    initialCategory ? initialAnswers(initialCategory) : null,
  );
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [questionStep, setQuestionStep] = useState(0);
  const [phase, setPhase] = useState<Phase>(initialCategory ? 'questions' : 'category');
  const [shareLoading, setShareLoading] = useState(false);
  const [draftBanner, setDraftBanner] = useState(false);
  const [resultsAnnouncement, setResultsAnnouncement] = useState('');
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  const fieldGroups = useMemo(
    () => (category ? getFormFieldGroups(category) : []),
    [category],
  );

  const fieldErrors = useMemo(() => {
    if (!answers || !fieldGroups[questionStep]) return {};
    const stepKeys = fieldGroups[questionStep].fields.map((f) => f.key);
    const required = showFieldErrors ? getRequiredFieldErrors(answers, stepKeys) : {};
    const softAll = getFieldErrors(answers as FormAnswers);
    const soft = Object.fromEntries(
      Object.entries(softAll).filter(([key]) => stepKeys.includes(key)),
    );
    return { ...required, ...soft };
  }, [answers, questionStep, fieldGroups, showFieldErrors]);

  const validationWarnings = useMemo(
    () => (answers ? validateFormAnswers(answers as FormAnswers) : []),
    [answers],
  );

  const totalSteps = fieldGroups.length;
  const isLastQuestionStep = questionStep >= totalSteps - 1;

  const resetToCategorySelection = useCallback(() => {
    setResult(null);
    setPhase('category');
    setCategory(null);
    setAnswers(null);
    setQuestionStep(0);
    setError(null);
    setShowFieldErrors(false);
    setDraftBanner(false);
    setResultsAnnouncement('');
  }, []);

  useEffect(() => {
    if (matcherReset !== 'category' || shareToken || initialCategory) return;
    resetToCategorySelection();
    router.replace('/', { scroll: false });
    requestAnimationFrame(() => {
      document.getElementById('matcher')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [matcherReset, shareToken, initialCategory, resetToCategorySelection, router]);

  useEffect(() => {
    if (!shareToken) {
      setShareLoading(false);
      return;
    }
    setShareLoading(true);
    const payload = decodeSharePayload(shareToken);
    if (!payload) {
      setError('This share link is invalid or expired.');
      setPhase(initialCategory ? 'questions' : 'category');
      setResult(null);
      setShareLoading(false);
      return;
    }
    try {
      buildUserProfile(payload.answers);
      const recommendation = onFormSubmit(payload.answers);
      setCategory(payload.answers.category);
      setAnswers(payload.answers);
      setResult(recommendation);
      setPhase('results');
      setResultsAnnouncement('Match results loaded.');
      setError(null);
    } catch {
      setError('Could not load shared results.');
      setPhase(initialCategory ? 'questions' : 'category');
      setResult(null);
    }
    setShareLoading(false);
  }, [shareToken, initialCategory]);

  useEffect(() => {
    if (!category || !answers || phase !== 'questions') return;
    saveDraft(category, answers);
  }, [category, answers, phase]);

  useEffect(() => {
    if (!initialCategory || shareToken) return;
    const draft = loadDraft(initialCategory);
    if (draft) setDraftBanner(true);
  }, [initialCategory, shareToken]);

  const handleChange = useCallback((key: string, value: string | number) => {
    setAnswers((prev) => (prev ? { ...prev, [key]: value } : prev));
    setError(null);
  }, []);

  function validateCurrentStep(): boolean {
    if (!answers || !fieldGroups[questionStep]) return false;
    const stepKeys = fieldGroups[questionStep].fields.map((f) => f.key);
    const stepErrors = getRequiredFieldErrors(answers, stepKeys);
    if (Object.keys(stepErrors).length > 0) {
      setShowFieldErrors(true);
      setError('Please complete all fields on this step before continuing.');
      return false;
    }
    return true;
  }

  function handleCategorySelect(next: RobotCategory) {
    if (initialCategory && next !== initialCategory) {
      router.push(CATEGORY_ROUTES[next]);
      return;
    }
    const draft = loadDraft(next);
    setCategory(next);
    setAnswers(draft ?? initialAnswers(next));
    setDraftBanner(!!draft);
    setResult(null);
    setError(null);
    setShowFieldErrors(false);
    setQuestionStep(0);
    setPhase('questions');
    requestAnimationFrame(() => {
      document.getElementById('matcher-questions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function runMatch(currentAnswers: WizardAnswers) {
    buildUserProfile(currentAnswers);
    const recommendation = onFormSubmit(currentAnswers as FormAnswers);
    if (category) clearDraft(category);
    setDraftBanner(false);
    setResult(recommendation);
    setPhase('results');
    setResultsAnnouncement(
      `Recommendation ready: ${recommendation.bestRobotMatch.robotType.replace(/_/g, ' ')}.`,
    );
    requestAnimationFrame(() => {
      document.getElementById('match-results')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLastQuestionStep) {
      handleNext();
      return;
    }
    if (!answers || !validateCurrentStep()) return;
    setError(null);
    try {
      runMatch(answers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    if (!isLastQuestionStep) {
      setQuestionStep((s) => s + 1);
      setShowFieldErrors(false);
      setError(null);
      return;
    }
    if (!answers) return;
    setError(null);
    try {
      runMatch(answers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  }

  function handleBack() {
    if (questionStep > 0) {
      setQuestionStep((s) => s - 1);
      setShowFieldErrors(false);
      setError(null);
      return;
    }
    setPhase('category');
    setCategory(null);
    setAnswers(null);
    setShowFieldErrors(false);
    setError(null);
  }

  function handleReset() {
    setResult(null);
    setPhase('questions');
    setQuestionStep(0);
    if (category) setAnswers(initialAnswers(category));
  }

  function handleStartOver() {
    if (category) clearDraft(category);
    setDraftBanner(false);
    resetToCategorySelection();
  }

  function dismissDraftBanner() {
    setDraftBanner(false);
  }

  if (shareLoading) {
    return <MatcherSkeleton />;
  }

  if (phase === 'results' && result && answers) {
    return (
      <div className="space-y-6">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {resultsAnnouncement}
        </div>
        <div className="no-print flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={handleReset}>
            Edit answers
          </Button>
          <ShareResultsButton answers={answers as FormAnswers} result={result} />
          <CopyResultsSummaryButton result={result} />
          <EmailResultsButton result={result} />
          <DownloadSummaryButton result={result} />
          <SavePdfButton />
          {!initialCategory && (
            <Button type="button" variant="ghost" onClick={handleStartOver}>
              Start over
            </Button>
          )}
        </div>
        <MatchResults result={result} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {resultsAnnouncement}
      </div>

      {error && phase !== 'questions' && (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      )}

      {draftBanner && category && (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent/30 bg-accent-soft/40 px-3 py-2 text-sm"
          role="status"
        >
          <span>Resume where you left off — your answers were saved.</span>
          <button
            type="button"
            onClick={dismissDraftBanner}
            className="font-medium text-accent hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {phase === 'category' && (
        <section>
          <h2 className="text-xl font-semibold">
            {initialCategory ? 'Switch category' : 'Get your robot match'}
          </h2>
          <p className="mt-1 mb-4 text-sm text-ink-muted">
            {initialCategory
              ? 'Pick a different operation type.'
              : 'Pick your operation type.'}
          </p>
          <CategorySelector selected={category} onSelect={handleCategorySelect} />
        </section>
      )}

      {phase === 'questions' && category && answers && fieldGroups[questionStep] && (
        <form id="matcher-questions" onSubmit={handleSubmit} className="scroll-mt-8">
          <div className="mb-4 flex items-center justify-between gap-4 text-sm">
            <span className="font-medium text-ink">
              Step {questionStep + 1} of {totalSteps}
            </span>
            <div
              className="flex h-2 flex-1 max-w-xs gap-1"
              role="progressbar"
              aria-valuenow={questionStep + 1}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label="Question progress"
            >
              {fieldGroups.map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 rounded-full transition-colors ${i <= questionStep ? 'bg-accent' : 'bg-surface-border'}`}
                />
              ))}
            </div>
          </div>

          <h2 className="mb-1 flex items-center gap-2 text-base font-semibold">
            {fieldGroups[questionStep].icon && (
              <StepIcon id={fieldGroups[questionStep].icon!} className="shrink-0 text-accent" />
            )}
            {fieldGroups[questionStep].title}
          </h2>
          {fieldGroups[questionStep].description && (
            <p className="mb-4 text-sm text-ink-muted">{fieldGroups[questionStep].description}</p>
          )}

          <div key={questionStep} className="animate-step-in motion-reduce:animate-none">
          {error && (
            <p
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              role="alert"
            >
              {error}
            </p>
          )}

          {validationWarnings.length > 0 && (
            <div
              className="mb-4 rounded-lg border border-warn/30 bg-warn-soft px-3 py-2 text-sm text-warn"
              role="status"
            >
              <p className="font-medium">Please review</p>
              <ul className="mt-1 list-inside list-disc">
                {validationWarnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <QuestionFlow
            groups={[fieldGroups[questionStep]]}
            answers={answers}
            onChange={handleChange}
            fieldErrors={fieldErrors}
          />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={handleBack}>
              Back
            </Button>
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
    </div>
  );
}

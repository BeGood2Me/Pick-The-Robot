'use client';

import { useState } from 'react';
import type { WizardAnswers } from '@/lib/forms/types';
import { isFieldEmpty, sqFtToSqM, sqMToSqFt } from '@/lib/forms/validateAnswers';
import type { FormFieldGroup } from '@/lib/forms/questions';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';

type AreaUnit = 'sqm' | 'sqft';

function AreaInput({
  field,
  answers,
  onChange,
  error,
}: {
  field: FormFieldGroup['fields'][number];
  answers: WizardAnswers;
  onChange: (key: string, value: string | number) => void;
  error?: string;
}) {
  const [unit, setUnit] = useState<AreaUnit>('sqm');
  const raw = answers[field.key as keyof WizardAnswers];
  const sqM = typeof raw === 'number' && !isFieldEmpty(raw) ? raw : null;
  const displayValue =
    sqM == null
      ? ''
      : unit === 'sqm'
        ? Number.isInteger(sqM)
          ? sqM
          : Number(sqM.toFixed(2))
        : Math.round(sqMToSqFt(sqM));

  function handleValueChange(input: string) {
    if (input === '') {
      onChange(field.key, '');
      return;
    }
    const n = Number(input);
    const stored = unit === 'sqft' ? sqFtToSqM(n) : n;
    onChange(field.key, stored);
  }

  return (
    <Field
      id={field.key}
      label={field.label}
      helpText={field.helpText}
      error={error}
      fullWidth
    >
      <div className="space-y-2">
        <div className="flex gap-2 text-xs" role="group" aria-label="Area unit">
          <button
            type="button"
            aria-pressed={unit === 'sqm'}
            onClick={() => setUnit('sqm')}
            className={cn(
              'rounded px-2 py-1 transition-colors',
              unit === 'sqm' ? 'bg-accent text-white' : 'bg-surface-soft text-ink-muted',
            )}
          >
            m²
          </button>
          <button
            type="button"
            aria-pressed={unit === 'sqft'}
            onClick={() => setUnit('sqft')}
            className={cn(
              'rounded px-2 py-1 transition-colors',
              unit === 'sqft' ? 'bg-accent text-white' : 'bg-surface-soft text-ink-muted',
            )}
          >
            sq ft
          </button>
        </div>
        <Input
          id={field.key}
          type="number"
          min={field.min}
          max={field.max}
          step={unit === 'sqft' ? 100 : (field.step ?? 1)}
          value={displayValue}
          onChange={(e) => handleValueChange(e.target.value)}
          hasError={!!error}
        />
      </div>
    </Field>
  );
}

export function QuestionFlow({
  groups,
  answers,
  onChange,
  fieldErrors = {},
}: {
  groups: FormFieldGroup[];
  answers: WizardAnswers;
  onChange: (key: string, value: string | number) => void;
  fieldErrors?: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <fieldset key={group.title} className="space-y-4">
          <legend className="sr-only">{group.title}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.fields.map((field) => {
              const error = fieldErrors[field.key];
              if (field.areaUnit) {
                return (
                  <AreaInput
                    key={field.key}
                    field={field}
                    answers={answers}
                    onChange={onChange}
                    error={error}
                  />
                );
              }

              const raw = answers[field.key as keyof WizardAnswers];

              if (field.type === 'select' && field.options) {
                const selectValue = isFieldEmpty(raw) ? '' : String(raw);
                return (
                  <Field
                    key={field.key}
                    id={field.key}
                    label={field.label}
                    helpText={field.helpText}
                    error={error}
                  >
                    <Select
                      id={field.key}
                      value={selectValue}
                      onChange={(e) => onChange(field.key, e.target.value)}
                      hasError={!!error}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                );
              }

              const numberValue =
                typeof raw === 'number' && !isFieldEmpty(raw) ? raw : '';

              return (
                <Field
                  key={field.key}
                  id={field.key}
                  label={field.label}
                  helpText={field.helpText}
                  error={error}
                >
                  <Input
                    id={field.key}
                    type="number"
                    min={field.min}
                    max={field.max}
                    step={field.step ?? 1}
                    value={numberValue}
                    onChange={(e) => {
                      const v = e.target.value;
                      onChange(field.key, v === '' ? '' : Number(v));
                    }}
                    hasError={!!error}
                  />
                </Field>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

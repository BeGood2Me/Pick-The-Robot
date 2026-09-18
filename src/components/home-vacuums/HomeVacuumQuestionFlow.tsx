'use client';

import { Field } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import type { HomeVacuumFieldGroup } from '@/lib/home-vacuums/questions';
import type { WizardHomeVacuumAnswers } from '@/lib/home-vacuums/types';

export function HomeVacuumQuestionFlow({
  groups,
  answers,
  onChange,
  fieldErrors = {},
}: {
  groups: HomeVacuumFieldGroup[];
  answers: WizardHomeVacuumAnswers;
  onChange: (key: keyof WizardHomeVacuumAnswers, value: string | boolean) => void;
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
              const raw = answers[field.key];
              const selectValue =
                field.type === 'boolean'
                  ? raw === undefined
                    ? ''
                    : String(raw)
                  : typeof raw === 'string'
                    ? raw
                    : '';

              return (
                <Field
                  key={field.key}
                  id={field.key}
                  label={field.label}
                  helpText={field.helpText}
                  error={error}
                  fullWidth={group.fields.length === 1}
                >
                  <Select
                    id={field.key}
                    value={selectValue}
                    hasError={!!error}
                    onChange={(e) => {
                      const next = e.target.value;
                      if (field.type === 'boolean') {
                        onChange(field.key, next === 'true');
                        return;
                      }
                      onChange(field.key, next);
                    }}
                  >
                    <option value="">Select…</option>
                    {(field.options ?? []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

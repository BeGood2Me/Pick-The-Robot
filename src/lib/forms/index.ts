export { buildUserProfile } from './buildProfile';
export { validateFormAnswers, getFieldErrors, getRequiredFieldErrors, assertFormComplete, isFieldEmpty, sqFtToSqM, sqMToSqFt } from './validateAnswers';
export { clearDraft, loadDraft, saveDraft } from './draft';
export {
  emptyAnswersForCategory,
  defaultAnswersForCategory,
  normalizeFormAnswers,
  DEFAULT_BASE_ANSWERS,
} from './defaults';
export {
  getFormFields,
  getFormFieldGroups,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
  type FormField,
  type FormFieldGroup,
  type SelectOption,
  type StepIconId,
} from './questions';
export type {
  FormAnswers,
  WarehouseFormAnswers,
  CleaningFormAnswers,
  RestaurantFormAnswers,
  BaseFormAnswers,
  FormAnswersForCategory,
  WizardAnswers,
} from './types';
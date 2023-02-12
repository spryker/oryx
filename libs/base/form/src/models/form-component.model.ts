export interface FormMixinProperties<FormValues = unknown> {
  getForm(): HTMLFormElement | null;
  submit(): void;

  values?: FormValues;
}

export const SUBMIT_EVENT = 'oryx.submit';

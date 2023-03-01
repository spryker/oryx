export interface FormAssociatedElement
  extends Partial<FormDisabledCallback>,
    Partial<FormResetCallback>,
    Partial<FormStateRestoreCallback> {
  form: HTMLFormElement | null;
  validity: ValidityState;
  validationMessage: string;
  willValidate: boolean;
  checkValidity(): boolean;
  reportValidity(): boolean;
}

export interface FormDisabledCallback {
  formDisabledCallback(isDisabled: boolean): void;
}

export interface FormResetCallback {
  formResetCallback(): void;
}

export interface FormStateRestoreCallback {
  formStateRestoreCallback(state: unknown): void;
}

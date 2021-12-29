export interface Props {
  value: string;
  label: string;
  disabled: boolean;
  readonly: boolean;
  placeholder: string;

  error: string;
  showError: boolean;

  prefixIcon: string;
  prefixFill: boolean;

  suffixIcon: string;
  suffixFill: boolean;
}

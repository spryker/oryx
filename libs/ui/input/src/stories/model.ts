export interface Props {
  value: string;
  label: string;
  disabled: boolean;
  readonly: boolean;
  placeholder: string;

  errorMessage: string;

  prefixIcon: string;
  prefixFill: boolean;
  suffixIcon: string;
  suffixFill: boolean;
}

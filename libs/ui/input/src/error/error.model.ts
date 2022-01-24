import { TemplateResult } from 'lit';

export declare class ErrorInterface {
  errorMessage: string;
  protected renderError(): TemplateResult;
  protected hasError(): boolean;
}

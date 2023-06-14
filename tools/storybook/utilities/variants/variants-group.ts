import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';

export interface VariantsGroup<T> {
  title: string;
  options: T;
}

interface VariantsGroupOptions {
  title: string;
  addSeparator?: boolean;
}

export const variantsGroupTemplate = (
  slottedContent: () => TemplateResult,
  options: VariantsGroupOptions
): TemplateResult => html`
  <h3>${options.title}</h3>
  ${slottedContent()} ${when(options.addSeparator, () => html`<hr />`)}
`;

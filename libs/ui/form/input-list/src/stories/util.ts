import { html, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';

export enum UxType {
  checkbox = 'checkbox',
  radio = 'radio',
  toggle = 'toggle',
  toggleIcon = 'toggleIcon',
  toggleButton = 'toggleButton',
}

export const inputs = ['mobile', 'tablet', 'desktop'];

export const input = (
  item: string,
  hasText = true,
  checked = false
): TemplateResult => html`
  <input type="checkbox" ?checked=${checked} />
  ${when(hasText, () => html`${item}`)}
`;

export const InputListDecorator =
  () =>
  (storyFn: any): TemplateResult => {
    return html`
      ${storyFn()}
      <style>
        oryx-input-list {
          display: block;
          margin: 20px 0;
        }
      </style>
    `;
  };

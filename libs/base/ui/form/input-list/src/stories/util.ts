import { IconTypes } from '@spryker-oryx/ui/icon';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';

export enum UxType {
  checkbox = 'checkbox',
  radio = 'radio',
  toggle = 'toggle',
  toggleIcon = 'toggleIcon',
  toggleButton = 'toggleButton',
}

export const inputs = [IconTypes.Mobile, IconTypes.Tablet, IconTypes.Desktop];
export const text: Record<string, string> = {
  [IconTypes.Mobile]: 'mobile',
  [IconTypes.Tablet]: 'tablet',
  [IconTypes.Desktop]: 'desktop',
};

export const input = (
  item: string,
  hasText = true,
  checked = false
): TemplateResult => html`
  <input type="checkbox" ?checked=${checked} aria-label=${item} />
  ${when(hasText, () => html`${text[item]}`)}
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

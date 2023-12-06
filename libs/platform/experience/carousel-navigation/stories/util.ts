import { TemplateResult, html } from 'lit';

export const items = (count: number): TemplateResult[] => {
  return Array.from({ length: count }, (_, i) => {
    const item = (id: number, postfix?: string) =>
      html`<div id="item-${id}">${id}${postfix}</div>`;

    return item(i + 1);
  });
};

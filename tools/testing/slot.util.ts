import { fixture, unsafeStatic } from '@open-wc/testing-helpers';
import { queryFirstAssigned } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { html as staticHtml } from 'lit/static-html.js';
import { beforeEach, describe, expect, it } from 'vitest';

interface CheckSlotsTemplate {
  tag: string;
  attributes: string[];
}

export const checkSlots = (slots: string[], template: CheckSlotsTemplate) => {
  const generateTemplate = (
    { tag, attributes }: CheckSlotsTemplate,
    slotContent: TemplateResult
  ): TemplateResult => {
    const attributesString = attributes.reduce(
      (acc, current) => `${acc} ${current}`,
      ''
    );

    return staticHtml`
      <${unsafeStatic(tag)}${unsafeStatic(
      attributesString
    )}>${slotContent}</${unsafeStatic(tag)}>
    `;
  };

  let element: LitElement;

  slots.forEach((slotName) => {
    describe(`when ${slotName} is provided by slot`, () => {
      const slotText = `${slotName} slot mock text`;

      beforeEach(async () => {
        const slotContent =
          slotName !== 'default'
            ? html` <p slot=${slotName} data-testid=${`${slotName}Slot`}>
                ${slotText}
              </p>`
            : html`<p data-testid=${`${slotName}Slot`}>${slotText}</p>`;

        element = await fixture(generateTemplate(template, slotContent));
      });

      it(`should pass ${slotName} slot to oryx-card by slot`, () => {
        const options = {
          selector: `[data-testid="${slotName}Slot"]`,
          slot: slotName !== 'default' ? slotName : undefined,
        };

        const el = queryFirstAssigned(element, options) as HTMLElement;

        expect(el?.textContent?.trim()).toBe(slotText);
      });
    });
  });
};

import { TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { html } from 'lit/static-html.js';

export interface Variant {
  categoryX: string;
  categoryY: string;
}

const styles = html`
  <style>
    .row {
      display: flex;
      align-items: center;
      gap: 40px;
      margin-bottom: 24px;
    }
    .col {
      display: flex;
      flex-direction: column;
      gap: 24px;
      width: 150px;
    }
  </style>
`;

export const generateVariantsMatrix = <T extends Variant>(
  variants: T[],
  renderer: (variant: T) => TemplateResult,
  categoriesOrder?: { categoriesX?: string[]; categoriesY?: string[] }
): TemplateResult => {
  const categoriesY = categoriesOrder?.categoriesY || [
    ...new Set(variants.map(({ categoryY }) => categoryY)),
  ];
  const categoriesX = categoriesOrder?.categoriesX || [
    ...new Set(variants.map(({ categoryX }) => categoryX)),
  ];

  const getVariant = (categoryX: string, categoryY: string): T | undefined => {
    return variants.find(
      (variant) =>
        variant.categoryX === categoryX && variant.categoryY === categoryY
    );
  };

  return html`
    <div class="row">
      <div class="col"></div>
      ${categoriesY.map((header) => html`<div class="col">${header}</div>`)}
    </div>
    ${categoriesX.map(
      (categoryX) => html`
        <div class="row">
          <div class="col">${categoryX}</div>
          ${categoriesY.map(
            (categoryY) => html`
              <div class="col">
                ${when(getVariant(categoryX, categoryY), () =>
                  renderer(getVariant(categoryX, categoryY)!)
                )}
              </div>
            `
          )}
        </div>
      `
    )}
    ${styles}
  `;
};

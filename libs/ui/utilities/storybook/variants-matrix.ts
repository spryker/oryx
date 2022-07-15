import { TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { html } from 'lit/static-html.js';

export interface Variant {
  categoryX: string;
  categoryY: string;
}

const styles = html`
  <style>
    th,
    td {
      padding: 10px;
    }
  </style>
`;

export const generateVariantsMatrix = <T extends Variant>(
  variants: T[],
  renderer: (variant: T) => TemplateResult,
  options?: {
    axisXOrder?: string[];
    axisYOrder?: string[];
    hideXAxisName?: boolean;
    hideYAxisName?: boolean;
  }
): TemplateResult => {
  const categoriesY = options?.axisYOrder || [
    ...new Set(variants.map(({ categoryY }) => categoryY)),
  ];
  const categoriesX = options?.axisXOrder || [
    ...new Set(variants.map(({ categoryX }) => categoryX)),
  ];

  const getVariant = (categoryX: string, categoryY: string): T | undefined => {
    return variants.find(
      (variant) =>
        variant.categoryX === categoryX && variant.categoryY === categoryY
    );
  };

  return html`
    <table>
      <tr>
        ${when(
          !options?.hideYAxisName,
          () => html`
            <th></th>
            ${categoriesY.map((header) => html`<th>${header}</th>`)}
          `
        )}
      </tr>
      ${categoriesX.map(
        (categoryX) => html`
          <tr>
            <td>${options?.hideXAxisName ? '' : categoryX}</td>
            ${categoriesY.map(
              (categoryY) => html`
                <td>
                  ${when(getVariant(categoryX, categoryY), () =>
                    renderer(getVariant(categoryX, categoryY)!)
                  )}
                </td>
              `
            )}
          </tr>
        `
      )}
    </table>

    ${styles}
  `;
};

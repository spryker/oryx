import { TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { html } from 'lit/static-html.js';
import { Variant } from './variant.model';

export const generateVariantsMatrix = <T extends Variant>(
  variants: T[],
  renderer: (variant: T) => TemplateResult,
  options?: {
    axisXOrder?: string[];
    axisYOrder?: string[];
    hideXAxisName?: boolean;
    hideYAxisName?: boolean;
    smallDisplayBreakpoint?: number;
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

  const capitalized = (label: string): string =>
    label && label[0].toUpperCase() + label.slice(1);

  return html`
    <table>
      <tr>
        ${when(
          !options?.hideYAxisName,
          () => html`
            ${when(!options?.hideXAxisName, () => html`<th></th>`)}
            ${categoriesY.map(
              (header) => html`<th>${capitalized(header)}</th>`
            )}
          `
        )}
      </tr>
      ${categoriesX.map(
        (categoryX) => html`
          <tr>
            ${when(
              !options?.hideXAxisName,
              () => html`<td>${capitalized(categoryX)}</td>`
            )}
            ${categoriesY.map(
              (categoryY) => html`
                <td>
                  ${when(
                    getVariant(categoryX, categoryY),
                    () =>
                      html`
                        <p>
                          <b
                            >${capitalized(categoryX)}${capitalized(
                              categoryY
                            ) && ','}
                            ${capitalized(categoryY)}</b
                          >
                        </p>
                        ${renderer(getVariant(categoryX, categoryY)!)}
                      `
                  )}
                </td>
              `
            )}
          </tr>
        `
      )}
    </table>

    <style>
      th,
      td {
        padding: 10px;
      }

      td > p {
        display: none;
      }

      @media (max-width: ${options?.smallDisplayBreakpoint}px) {
        tr th,
        tr td:first-child {
          display: none;
        }

        td > p {
          display: block;
        }

        th,
        td {
          display: inline-block;
          width: 100%;
        }
      }
    </style>
  `;
};

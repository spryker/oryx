import { generateVariantsMatrix, Variant } from '@spryker-oryx/ui/utilities';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

interface MiniCartVariant extends Variant {
  options: {
    className?: string;
  };
}

enum CategoryY {
  ZERO = '0',
  ONE = '<10',
  TWO = '<99',
  THREE = '99+',
}

enum CategoryX {
  DEFAULT = 'Default',
  HOVERED = 'Hovered',
  FOCUSED = 'Focused',
  ACTIVE = 'Active',
}

const getPseudoClass = (categoryX: CategoryX): string => {
  switch (categoryX) {
    case CategoryX.HOVERED:
      return 'pseudo-hover';
    case CategoryX.FOCUSED:
      return 'pseudo-focus-visible';
    case CategoryX.ACTIVE:
      return 'pseudo-active';
    default:
      return '';
  }
};

export const generateVariants = (): MiniCartVariant[] => {
  const result: MiniCartVariant[] = [];

  Object.values(CategoryY).forEach((categoryY) => {
    Object.values(CategoryX).forEach((categoryX) => {
      result.push({
        categoryY,
        categoryX,
        options: {
          className: getPseudoClass(categoryX),
        },
      });
    });
  });

  return result;
};

export const getTemplate = (ids: string[] = []): TemplateResult => html`
  ${ids.map(
    (id) => html`<h3>${id}</h3>
      ${generateVariantsMatrix(
        generateVariants(),
        ({ options: { className } }) => html`
          <div class=${ifDefined(className)}>
            <oryx-cart-summary
              cartId=${id}
              .options=${{ maxVisibleQuantity: 99 }}
            ></oryx-cart-summary>
          </div>
        `,
        { hideYAxisName: true }
      )} `
  )}
`;

import { generateVariantsMatrix, Variant } from '@spryker-oryx/ui/utilities';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';

interface MiniCartVariant extends Variant {
  options: {
    quantity: number;
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

const getQuantity = (categoryY: CategoryY): number => {
  switch (categoryY) {
    case CategoryY.ZERO:
      return 0;
    case CategoryY.ONE:
      return 5;
    case CategoryY.TWO:
      return 56;
    case CategoryY.THREE:
      return 156;
    default:
      return 0;
  }
};

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
          quantity: getQuantity(categoryY),
        },
      });
    });
  });

  return result;
};

export const getTemplate = (): TemplateResult => html`
  ${generateVariantsMatrix(
    generateVariants(),
    ({ options: { quantity, className } }) => html`
      <div class=${className}>
        <mini-cart .options=${{ quantity }}></mini-cart>
      </div>
    `,
    { hideYAxisName: true }
  )}
`;

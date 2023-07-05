import { generateVariantsMatrix, Variant } from '@/tools/storybook';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

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

const generateVariants = (): Variant[] => {
  const result: Variant[] = [];
  Object.values(CategoryX).forEach((categoryX) => {
    result.push({
      categoryY: '',
      categoryX,
      options: {
        className: getPseudoClass(categoryX),
      },
    });
  });

  return result;
};

export const renderVariants = (): TemplateResult => html`
  ${generateVariantsMatrix(
    generateVariants(),
    ({ options: { className } }) => html`
      <div class=${ifDefined(className)}>
        <oryx-site-navigation-button
          icon="add"
          text="label"
        ></oryx-site-navigation-button>
      </div>
    `,
    { hideYAxisName: true }
  )}
`;

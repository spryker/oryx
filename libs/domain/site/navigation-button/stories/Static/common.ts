import { generateVariantsMatrix, Variant } from '@/tools/storybook';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { NavigationButtonComponent } from '../../navigation-button.component';

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
      return 'pseudo-active pseudo-hover';
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
      <div class="pseudo-parent" data-pseudo=${ifDefined(className)}>
        <oryx-site-navigation-button
          icon="add"
          text="label"
        ></oryx-site-navigation-button>
      </div>
    `,
    { hideYAxisName: true }
  )}
`;

export const applyPseudoClasses = async (obj: {
  canvasElement: HTMLElement;
}): Promise<void> => {
  await Promise.all([
    customElements.whenDefined('oryx-site-navigation-button'),
    customElements.whenDefined('oryx-button'),
  ]);

  obj.canvasElement
    .querySelectorAll<HTMLElement>('.pseudo-parent')
    .forEach((parent) => {
      const pseudo = parent.dataset.pseudo;
      const button = parent.querySelector<NavigationButtonComponent>(
        'oryx-site-navigation-button'
      );

      if (pseudo) {
        setTimeout(() => {
          pseudo.split(' ').forEach((pseudoClass) => {
            button?.renderRoot
              .querySelector('oryx-button')
              ?.classList.add(pseudoClass);
          });
        }, 0);
      }
    });
};

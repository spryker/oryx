import { generateVariantsMatrix, Variant } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../../.constants';

export default { title: `${storybookPrefix}/Graphical/Chip/Static` } as Meta;

const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim';

enum CategoryY {
  Dense = 'Dense_or_not',
  Standard = 'Standard',
  Invert = 'Invert',
  Truncated = 'Truncated',
}

const generateVariants = (): Variant[] => {
  const result: Variant[] = [];

  Object.values(CategoryY).forEach((categoryY) => {
    Object.values(['success', 'info', 'warning', 'error', '(none)']).forEach(
      (categoryX) => {
        result.push({
          categoryY,
          categoryX,
          options: {},
        });
      }
    );
  });

  return result;
};

const Template: Story = (): TemplateResult => {
  return html`
    ${generateVariantsMatrix(
      generateVariants(),
      ({ categoryX, categoryY }) => html`
        ${when(
          categoryY === CategoryY.Dense,
          () =>
            [...Array(10).keys()].map(
              (num) => html`
                <oryx-chip .appearance=${categoryX} dense>
                  ${num + 1}
                </oryx-chip>
              `
            ),
          () => html`
            <oryx-chip
              .appearance=${categoryX}
              ?dense=${categoryY === CategoryY.Dense}
              ?invert=${categoryY === CategoryY.Invert}
            >
              ${categoryY === CategoryY.Truncated ? longText : categoryY}
            </oryx-chip>
          `
        )}
      `
    )}

    <style>
      oryx-chip {
        max-width: 200px;
      }
    </style>
  `;
};

export const States = Template.bind({});

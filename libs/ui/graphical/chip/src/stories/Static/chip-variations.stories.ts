import { generateVariantsMatrix, Variant } from '@spryker-oryx/ui/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../../.constants';
import { ChipAppearance } from '../../chip.model';

export default { title: `${storybookPrefix}/Graphical/Chip/Static` } as Meta;

const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim';

enum CategoryY {
  Dense = 'Dense',
  Standard = 'Standard',
  Truncated = 'Truncated',
}

const generateVariants = (): Variant[] => {
  const result: Variant[] = [];

  Object.values(CategoryY).forEach((categoryY) => {
    Object.values(ChipAppearance).forEach((categoryX) => {
      result.push({
        categoryY,
        categoryX,
        options: {},
      });
    });
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
                <oryx-chip appearance=${categoryX} dense>
                  ${num + 1}
                </oryx-chip>
              `
            ),
          () => html`
            <oryx-chip
              appearance=${categoryX}
              ?dense=${categoryY === CategoryY.Dense}
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

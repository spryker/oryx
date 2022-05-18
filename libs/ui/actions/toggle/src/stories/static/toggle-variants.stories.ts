import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { generateVariantsMatrix, Variant } from '../../../../../utilities';
import '../../index';

export default { title: `${storybookPrefix}/Actions/Toggle/Static` } as Meta;

const inputTypes = ['checkbox', 'radio'];

interface ToggleVariant extends Variant {
  options: {
    className?: string;
    checked?: boolean;
    disabled?: boolean;
  };
}

const variants: ToggleVariant[] = [
  {
    categoryY: 'Off',
    categoryX: 'Default',
    options: {},
  },
  {
    categoryY: 'On',
    categoryX: 'Default',
    options: {
      checked: true,
    },
  },
  {
    categoryY: 'Off',
    categoryX: 'Hovered',
    options: {
      className: 'pseudo-hover',
    },
  },
  {
    categoryY: 'On',
    categoryX: 'Hovered',
    options: {
      className: 'pseudo-hover',
      checked: true,
    },
  },
  {
    categoryY: 'Off',
    categoryX: 'Active',
    options: {
      className: 'pseudo-active pseudo-focus',
    },
  },
  {
    categoryY: 'On',
    categoryX: 'Active',
    options: {
      className: 'pseudo-active pseudo-focus',
      checked: true,
    },
  },
  {
    categoryY: 'Off',
    categoryX: 'Focused',
    options: {
      className: 'pseudo-focus pseudo-focus-visible',
    },
  },
  {
    categoryY: 'On',
    categoryX: 'Focused',
    options: {
      className: 'pseudo-focus pseudo-focus-visible',
      checked: true,
    },
  },
  {
    categoryY: 'Off',
    categoryX: 'Disabled',
    options: {
      disabled: true,
    },
  },
  {
    categoryY: 'On',
    categoryX: 'Disabled',
    options: {
      disabled: true,
      checked: true,
    },
  },
];

const Template: Story = (): TemplateResult => {
  return html`
    ${inputTypes.map(
      (inputType) => html`
        <h2>${inputType} based</h2>

        ${generateVariantsMatrix(
          variants,
          ({ options: { className, checked, disabled } }) => html`
            <oryx-toggle>
              <input
                type=${inputType}
                placeholder="make a11y happy"
                ?checked=${checked}
                class=${className}
                ?disabled=${disabled}
              />
            </oryx-toggle>
          `,
          {
            categoriesY: ['On', 'Off'],
          }
        )}
      `
    )}
  `;
};

export const ToggleVariants = Template.bind({});

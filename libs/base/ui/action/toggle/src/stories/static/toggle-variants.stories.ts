import { generateVariantsMatrix, Variant } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default { title: `${storybookPrefix}/Actions/Toggle/Static` } as Meta;

const inputTypes = ['checkbox', 'radio'];

interface ToggleVariant extends Variant {
  options: {
    className?: string;
    checked?: boolean;
    disabled?: boolean;
    hasError?: boolean;
    errorMessage?: string;
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
  {
    categoryY: 'Off',
    categoryX: 'Error Message',
    options: {
      disabled: false,
      hasError: true,
      errorMessage: 'Error message',
    },
  },
  {
    categoryY: 'On',
    categoryX: 'Error Message',
    options: {
      disabled: false,
      hasError: true,
      errorMessage: 'Error message',
      checked: true,
    },
  },
  {
    categoryY: 'Off',
    categoryX: 'Error',
    options: {
      disabled: false,
      hasError: true,
    },
  },
  {
    categoryY: 'On',
    categoryX: 'Error',
    options: {
      disabled: false,
      hasError: true,
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
          ({
            options: { className, checked, disabled, hasError, errorMessage },
          }) => html`
            <oryx-toggle ?hasError=${hasError} errorMessage=${errorMessage}>
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
            axisYOrder: ['On', 'Off'],
          }
        )}
      `
    )}
  `;
};

export const States = Template.bind({});

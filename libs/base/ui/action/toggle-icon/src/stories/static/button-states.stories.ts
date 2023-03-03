import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import {
  generateVariantsMatrix,
  Size,
  Variant,
} from '../../../../../src/utilities';

export default {
  title: `${storybookPrefix}/Actions/Toggle Button/Static`,
} as Meta;

interface ToggleIconVariant extends Variant {
  options: {
    className?: string;
    checked?: boolean;
    disabled?: boolean;
    size?: Size;
    hasError?: boolean;
  };
}

const variants: ToggleIconVariant[] = [
  {
    categoryX: 'Default',
    categoryY: 'Large Default',
    options: {
      checked: false,
      size: Size.Large,
    },
  },
  {
    categoryX: 'Default',
    categoryY: 'Large Clicked',
    options: {
      checked: true,
      size: Size.Large,
    },
  },
  {
    categoryX: 'Hovered',
    categoryY: 'Large Default',
    options: {
      checked: false,
      className: 'pseudo-hover',
      size: Size.Large,
    },
  },
  {
    categoryX: 'Hovered',
    categoryY: 'Large Clicked',
    options: {
      checked: true,
      className: 'pseudo-hover',
      size: Size.Large,
    },
  },
  {
    categoryX: 'Focused',
    categoryY: 'Large Default',
    options: {
      checked: false,
      className: 'pseudo-focus-visible',
      size: Size.Large,
    },
  },
  {
    categoryX: 'Focused',
    categoryY: 'Large Clicked',
    options: {
      checked: true,
      className: 'pseudo-focus-visible',
      size: Size.Large,
    },
  },
  {
    categoryX: 'Active',
    categoryY: 'Large Default',
    options: {
      checked: false,
      className: 'pseudo-active',
      size: Size.Large,
    },
  },
  {
    categoryX: 'Active',
    categoryY: 'Large Clicked',
    options: {
      checked: true,
      className: 'pseudo-active',
      size: Size.Large,
    },
  },
  {
    categoryX: 'Disabled',
    categoryY: 'Large Default',
    options: {
      checked: false,
      disabled: true,
      size: Size.Large,
    },
  },
  {
    categoryX: 'Disabled',
    categoryY: 'Large Clicked',
    options: {
      checked: true,
      disabled: true,
      size: Size.Large,
    },
  },
  {
    categoryX: 'Error',
    categoryY: 'Large Default',
    options: {
      checked: false,
      size: Size.Large,
      hasError: true,
    },
  },
  {
    categoryX: 'Error',
    categoryY: 'Large Clicked',
    options: {
      checked: true,
      size: Size.Large,
      hasError: true,
    },
  },

  //////////////

  {
    categoryX: 'Default',
    categoryY: 'Medium Default',
    options: {
      checked: false,
      size: Size.Medium,
    },
  },
  {
    categoryX: 'Default',
    categoryY: 'Medium Clicked',
    options: {
      checked: true,
      size: Size.Medium,
    },
  },
  {
    categoryX: 'Hovered',
    categoryY: 'Medium Default',
    options: {
      checked: false,
      className: 'pseudo-hover',
      size: Size.Medium,
    },
  },
  {
    categoryX: 'Hovered',
    categoryY: 'Medium Clicked',
    options: {
      checked: true,
      className: 'pseudo-hover',
      size: Size.Medium,
    },
  },
  {
    categoryX: 'Focused',
    categoryY: 'Medium Default',
    options: {
      checked: false,
      className: 'pseudo-focus-visible',
      size: Size.Medium,
    },
  },
  {
    categoryX: 'Focused',
    categoryY: 'Medium Clicked',
    options: {
      checked: true,
      className: 'pseudo-focus-visible',
      size: Size.Medium,
    },
  },
  {
    categoryX: 'Active',
    categoryY: 'Medium Default',
    options: {
      checked: false,
      className: 'pseudo-active',
      size: Size.Medium,
    },
  },
  {
    categoryX: 'Active',
    categoryY: 'Medium Clicked',
    options: {
      checked: true,
      className: 'pseudo-active',
      size: Size.Medium,
    },
  },
  {
    categoryX: 'Disabled',
    categoryY: 'Medium Default',
    options: {
      checked: false,
      disabled: true,
      size: Size.Medium,
    },
  },
  {
    categoryX: 'Disabled',
    categoryY: 'Medium Clicked',
    options: {
      checked: true,
      disabled: true,
      size: Size.Medium,
    },
  },
  {
    categoryX: 'Error',
    categoryY: 'Medium Default',
    options: {
      checked: false,
      size: Size.Medium,
      hasError: true,
    },
  },
  {
    categoryX: 'Error',
    categoryY: 'Medium Clicked',
    options: {
      checked: true,
      size: Size.Medium,
      hasError: true,
    },
  },

  //////////////

  {
    categoryX: 'Default',
    categoryY: 'Small Default',
    options: {
      checked: false,
      size: Size.Small,
    },
  },
  {
    categoryX: 'Default',
    categoryY: 'Small Clicked',
    options: {
      checked: true,
      size: Size.Small,
    },
  },
  {
    categoryX: 'Hovered',
    categoryY: 'Small Default',
    options: {
      checked: false,
      className: 'pseudo-hover',
      size: Size.Small,
    },
  },
  {
    categoryX: 'Hovered',
    categoryY: 'Small Clicked',
    options: {
      checked: true,
      className: 'pseudo-hover',
      size: Size.Small,
    },
  },
  {
    categoryX: 'Focused',
    categoryY: 'Small Default',
    options: {
      checked: false,
      className: 'pseudo-focus-visible',
      size: Size.Small,
    },
  },
  {
    categoryX: 'Focused',
    categoryY: 'Small Clicked',
    options: {
      checked: true,
      className: 'pseudo-focus-visible',
      size: Size.Small,
    },
  },
  {
    categoryX: 'Active',
    categoryY: 'Small Default',
    options: {
      checked: false,
      className: 'pseudo-active',
      size: Size.Small,
    },
  },
  {
    categoryX: 'Active',
    categoryY: 'Small Clicked',
    options: {
      checked: true,
      className: 'pseudo-active',
      size: Size.Small,
    },
  },
  {
    categoryX: 'Disabled',
    categoryY: 'Small Default',
    options: {
      checked: false,
      disabled: true,
      size: Size.Small,
    },
  },
  {
    categoryX: 'Disabled',
    categoryY: 'Small Clicked',
    options: {
      checked: true,
      disabled: true,
      size: Size.Small,
    },
  },
  {
    categoryX: 'Error',
    categoryY: 'Small Default',
    options: {
      checked: false,
      size: Size.Small,
      hasError: true,
    },
  },
  {
    categoryX: 'Error',
    categoryY: 'Small Clicked',
    options: {
      checked: true,
      size: Size.Small,
      hasError: true,
    },
  },
];

const Template: Story = (): TemplateResult => html`
  ${generateVariantsMatrix(
    variants,
    ({ options: { className, checked, disabled, size, hasError } }) => {
      return html`
        <oryx-toggle-icon size=${size} ?hasError=${hasError}>
          <input
            ?disabled=${disabled}
            ?checked=${checked}
            class=${className}
            type="radio"
            placeholder="make a11y happy"
            checked
          />
          <oryx-icon type="rocket"></oryx-icon>
          <span>Button</span>
        </oryx-toggle-icon>
      `;
    }
  )}

  <div class="truncated">
    <span>Truncated</span>
    <oryx-toggle-icon style="width: 200px">
      <input type="radio" placeholder="make a11y happy" />
      <oryx-icon type="rocket"></oryx-icon>
      <span
        >Truncated text requires an element. Truncated text requires an element.
        Truncated text requires an element.</span
      >
    </oryx-toggle-icon>
  </div>

  <style>
    .truncated {
      display: flex;
      align-items: center;
      padding: 10px;
      gap: 15px;
    }
  </style>
`;

export const States = Template.bind({});

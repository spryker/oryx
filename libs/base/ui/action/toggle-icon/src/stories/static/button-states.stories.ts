import { generateVariantsMatrix, Variant } from '@/tools/storybook';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

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
      size: Size.Lg,
    },
  },
  {
    categoryX: 'Default',
    categoryY: 'Large Clicked',
    options: {
      checked: true,
      size: Size.Lg,
    },
  },
  {
    categoryX: 'Hovered',
    categoryY: 'Large Default',
    options: {
      checked: false,
      className: 'pseudo-hover',
      size: Size.Lg,
    },
  },
  {
    categoryX: 'Hovered',
    categoryY: 'Large Clicked',
    options: {
      checked: true,
      className: 'pseudo-hover',
      size: Size.Lg,
    },
  },
  {
    categoryX: 'Focused',
    categoryY: 'Large Default',
    options: {
      checked: false,
      className: 'pseudo-focus-visible',
      size: Size.Lg,
    },
  },
  {
    categoryX: 'Focused',
    categoryY: 'Large Clicked',
    options: {
      checked: true,
      className: 'pseudo-focus-visible',
      size: Size.Lg,
    },
  },
  {
    categoryX: 'Active',
    categoryY: 'Large Default',
    options: {
      checked: false,
      className: 'pseudo-active',
      size: Size.Lg,
    },
  },
  {
    categoryX: 'Active',
    categoryY: 'Large Clicked',
    options: {
      checked: true,
      className: 'pseudo-active',
      size: Size.Lg,
    },
  },
  {
    categoryX: 'Disabled',
    categoryY: 'Large Default',
    options: {
      checked: false,
      disabled: true,
      size: Size.Lg,
    },
  },
  {
    categoryX: 'Disabled',
    categoryY: 'Large Clicked',
    options: {
      checked: true,
      disabled: true,
      size: Size.Lg,
    },
  },
  {
    categoryX: 'Error',
    categoryY: 'Large Default',
    options: {
      checked: false,
      size: Size.Lg,
      hasError: true,
    },
  },
  {
    categoryX: 'Error',
    categoryY: 'Large Clicked',
    options: {
      checked: true,
      size: Size.Lg,
      hasError: true,
    },
  },

  //////////////

  {
    categoryX: 'Default',
    categoryY: 'Medium Default',
    options: {
      checked: false,
      size: Size.Md,
    },
  },
  {
    categoryX: 'Default',
    categoryY: 'Medium Clicked',
    options: {
      checked: true,
      size: Size.Md,
    },
  },
  {
    categoryX: 'Hovered',
    categoryY: 'Medium Default',
    options: {
      checked: false,
      className: 'pseudo-hover',
      size: Size.Md,
    },
  },
  {
    categoryX: 'Hovered',
    categoryY: 'Medium Clicked',
    options: {
      checked: true,
      className: 'pseudo-hover',
      size: Size.Md,
    },
  },
  {
    categoryX: 'Focused',
    categoryY: 'Medium Default',
    options: {
      checked: false,
      className: 'pseudo-focus-visible',
      size: Size.Md,
    },
  },
  {
    categoryX: 'Focused',
    categoryY: 'Medium Clicked',
    options: {
      checked: true,
      className: 'pseudo-focus-visible',
      size: Size.Md,
    },
  },
  {
    categoryX: 'Active',
    categoryY: 'Medium Default',
    options: {
      checked: false,
      className: 'pseudo-active',
      size: Size.Md,
    },
  },
  {
    categoryX: 'Active',
    categoryY: 'Medium Clicked',
    options: {
      checked: true,
      className: 'pseudo-active',
      size: Size.Md,
    },
  },
  {
    categoryX: 'Disabled',
    categoryY: 'Medium Default',
    options: {
      checked: false,
      disabled: true,
      size: Size.Md,
    },
  },
  {
    categoryX: 'Disabled',
    categoryY: 'Medium Clicked',
    options: {
      checked: true,
      disabled: true,
      size: Size.Md,
    },
  },
  {
    categoryX: 'Error',
    categoryY: 'Medium Default',
    options: {
      checked: false,
      size: Size.Md,
      hasError: true,
    },
  },
  {
    categoryX: 'Error',
    categoryY: 'Medium Clicked',
    options: {
      checked: true,
      size: Size.Md,
      hasError: true,
    },
  },

  //////////////

  {
    categoryX: 'Default',
    categoryY: 'Small Default',
    options: {
      checked: false,
      size: Size.Sm,
    },
  },
  {
    categoryX: 'Default',
    categoryY: 'Small Clicked',
    options: {
      checked: true,
      size: Size.Sm,
    },
  },
  {
    categoryX: 'Hovered',
    categoryY: 'Small Default',
    options: {
      checked: false,
      className: 'pseudo-hover',
      size: Size.Sm,
    },
  },
  {
    categoryX: 'Hovered',
    categoryY: 'Small Clicked',
    options: {
      checked: true,
      className: 'pseudo-hover',
      size: Size.Sm,
    },
  },
  {
    categoryX: 'Focused',
    categoryY: 'Small Default',
    options: {
      checked: false,
      className: 'pseudo-focus-visible',
      size: Size.Sm,
    },
  },
  {
    categoryX: 'Focused',
    categoryY: 'Small Clicked',
    options: {
      checked: true,
      className: 'pseudo-focus-visible',
      size: Size.Sm,
    },
  },
  {
    categoryX: 'Active',
    categoryY: 'Small Default',
    options: {
      checked: false,
      className: 'pseudo-active',
      size: Size.Sm,
    },
  },
  {
    categoryX: 'Active',
    categoryY: 'Small Clicked',
    options: {
      checked: true,
      className: 'pseudo-active',
      size: Size.Sm,
    },
  },
  {
    categoryX: 'Disabled',
    categoryY: 'Small Default',
    options: {
      checked: false,
      disabled: true,
      size: Size.Sm,
    },
  },
  {
    categoryX: 'Disabled',
    categoryY: 'Small Clicked',
    options: {
      checked: true,
      disabled: true,
      size: Size.Sm,
    },
  },
  {
    categoryX: 'Error',
    categoryY: 'Small Default',
    options: {
      checked: false,
      size: Size.Sm,
      hasError: true,
    },
  },
  {
    categoryX: 'Error',
    categoryY: 'Small Clicked',
    options: {
      checked: true,
      size: Size.Sm,
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
          <oryx-icon .type=${IconTypes.Rocket}></oryx-icon>
          <span>Button</span>
        </oryx-toggle-icon>
      `;
    }
  )}

  <div class="truncated">
    <span>Truncated</span>
    <oryx-toggle-icon style="width: 200px">
      <input type="radio" placeholder="make a11y happy" />
      <oryx-icon .type=${IconTypes.Rocket}></oryx-icon>
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

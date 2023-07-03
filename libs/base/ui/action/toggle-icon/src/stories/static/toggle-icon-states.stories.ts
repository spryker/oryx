import { generateVariantsMatrix, Variant } from '@/tools/storybook';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Actions/Toggle Icon/Static`,
} as Meta;

interface ToggleIconVariant extends Variant {
  options: {
    className?: string;
    checked?: boolean;
    disabled?: boolean;
    hasError?: boolean;
  };
}

const variants: ToggleIconVariant[] = [
  {
    categoryX: 'Default',
    categoryY: 'Default',
    options: {
      checked: false,
    },
  },
  {
    categoryX: 'Default',
    categoryY: 'Clicked',
    options: {
      checked: true,
    },
  },
  {
    categoryX: 'Hovered',
    categoryY: 'Default',
    options: {
      checked: false,
      className: 'pseudo-hover',
    },
  },
  {
    categoryX: 'Hovered',
    categoryY: 'Clicked',
    options: {
      checked: true,
      className: 'pseudo-hover',
    },
  },
  {
    categoryX: 'Focused',
    categoryY: 'Default',
    options: {
      checked: false,
      className: 'pseudo-focus-visible',
    },
  },
  {
    categoryX: 'Focused',
    categoryY: 'Clicked',
    options: {
      checked: true,
      className: 'pseudo-focus-visible',
    },
  },
  {
    categoryX: 'Active',
    categoryY: 'Default',
    options: {
      checked: false,
      className: 'pseudo-active',
    },
  },
  {
    categoryX: 'Active',
    categoryY: 'Clicked',
    options: {
      checked: true,
      className: 'pseudo-active',
    },
  },
  {
    categoryX: 'Disabled',
    categoryY: 'Default',
    options: {
      checked: false,
      disabled: true,
    },
  },
  {
    categoryX: 'Disabled',
    categoryY: 'Clicked',
    options: {
      checked: true,
      disabled: true,
    },
  },
  {
    categoryX: 'Error',
    categoryY: 'Default',
    options: {
      checked: false,
      hasError: true,
    },
  },
  {
    categoryX: 'Error',
    categoryY: 'Clicked',
    options: {
      checked: true,
      hasError: true,
    },
  },
];

const Template: Story = (): TemplateResult =>
  generateVariantsMatrix(
    variants,
    ({ options: { className, checked, disabled, hasError } }) => html`
      <oryx-toggle-icon ?checked=${checked} ?hasError=${hasError}>
        <input
          ?disabled=${disabled}
          class=${className}
          type="radio"
          placeholder="make a11y happy"
          ?checked=${checked}
        />
        <oryx-icon .type=${IconTypes.Rocket}></oryx-icon>
      </oryx-toggle-icon>
    `
  );

export const States = Template.bind({});

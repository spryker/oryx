import {
  CategoryX,
  generateGroupItemVariants,
  generateVariantsMatrix,
  Variant,
  VariantOptions,
} from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../.constants';

export default { title: `${storybookPrefix}/Form/Radio/Static` } as Meta;

export interface RadioVariantOptions extends VariantOptions {
  subtext?: string;
  errorMessage?: string;
  hasError?: boolean;
  checked?: boolean;
  disabled?: boolean;
  className?: string;
  customErrorMessage?: string;
}

interface RadioVariant extends Variant {
  options: RadioVariantOptions;
}

enum CategoryY {
  UNCHECKED = 'Unchecked',
  CHECKED = 'Checked',
}

const defaultVariants: RadioVariant[] = [
  {
    categoryX: CategoryX.DEFAULT,
    categoryY: CategoryY.UNCHECKED,
    options: {},
  },
  {
    categoryX: CategoryX.DEFAULT,
    categoryY: CategoryY.CHECKED,
    options: {
      checked: true,
    },
  },
];

const Template: Story = (): TemplateResult => {
  return generateVariantsMatrix(
    generateGroupItemVariants(defaultVariants),
    ({
      options: {
        hasError,
        errorMessage,
        checked,
        disabled,
        className,
        subtext,
        customErrorMessage,
      },
    }) => html`
      <oryx-radio ?hasError=${hasError} errorMessage=${errorMessage}>
        <input
          type="checkbox"
          defaultValue="false"
          ?checked=${checked}
          @click=${(e: Event): void => e.preventDefault()}
          ?disabled=${disabled}
          class=${className}
        />
        Option
        ${when(subtext, () => html`<small slot="subtext">${subtext}</small>`)}
        ${when(
          customErrorMessage,
          () => html`<span slot="error">${customErrorMessage}</span>`
        )}
      </oryx-radio>
    `
  );
};

export const States = Template.bind({});

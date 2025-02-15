import {
  CategoryX as RadioCategoryX,
  Variant,
  generateGroupItemVariants,
  generateVariantsMatrix,
} from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../../.constants';
import { RadioVariantOptions } from '../../../../radio/src/stories/states.stories';

export default {
  title: `${storybookPrefix}/Form/Checkbox/Static`,
} as Meta;

interface CheckboxVariantOptions extends RadioVariantOptions {
  intermediate?: boolean;
}

interface CheckboxVariant extends Variant {
  options: CheckboxVariantOptions;
}

enum CategoryY {
  UNCHECKED = 'Unchecked',
  INTERMEDIATE = 'Intermediate',
  CHECKED = 'Checked',
}

const CategoryX = {
  ...RadioCategoryX,
};

const defaultVariants: CheckboxVariant[] = [
  {
    categoryX: CategoryX.DEFAULT,
    categoryY: CategoryY.UNCHECKED,
    options: {},
  },
  {
    categoryX: CategoryX.DEFAULT,
    categoryY: CategoryY.INTERMEDIATE,
    options: {
      intermediate: true,
    },
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
        intermediate,
        hasError,
        errorMessage,
        checked,
        disabled,
        className,
        subtext,
        customErrorMessage,
      },
    }) => html`
      <div class=${className}>
        <oryx-checkbox
          ?intermediate=${intermediate}
          ?hasError=${hasError}
          errorMessage=${errorMessage}
        >
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
        </oryx-checkbox>
      </div>
    `
  );
};

export const States = Template.bind({});

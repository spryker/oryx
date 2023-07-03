import {
  extendVariants,
  generateVariantsMatrix,
  storybookDefaultViewports,
  Variant,
  VariantOptions,
  VariantsGroup,
  variantsGroupTemplate,
} from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../../.constants';
import '../../index';
import { selectOptions } from './common';

export default {
  title: `${storybookPrefix}/Form/Select/Static`,
} as Meta;

interface SelectInputVariantOptions extends VariantOptions {
  floatLabel?: boolean;
  label?: string;
  selectedValue?: string | number;
  disabled?: boolean;
  withoutOptions?: boolean;
  isLoading?: boolean;
  withPlaceholder?: boolean;
}

interface SelectInputVariant extends Variant {
  options: SelectInputVariantOptions;
}

const groups: VariantsGroup<SelectInputVariantOptions>[] = [
  {
    title: 'Standard label',
    options: {
      floatLabel: false,
    },
  },
  {
    title: 'Floating label',
    options: {
      floatLabel: true,
    },
  },
];

enum CategoryY {
  CLOSED = 'Closed',
  OPENED = 'Open',
}

enum CategoryX {
  CUSTOM_LABEL = 'Custom label',
  DISABLED = 'Disabled',
  EMPTY = 'Empty',
  INPUT_BASED = 'Input based',
  PLACEHOLDER = 'Placeholder option',
  LOADING = 'Loading',
  SELECTED = 'Selected',
  TRUNCATED_LABEL = 'Truncated label',
  WITHOUT_OPTIONS = 'Without options',
}

const standardLabel = 'Standard label';

const closedSelectInputVariants: SelectInputVariant[] = [
  {
    categoryX: CategoryX.CUSTOM_LABEL,
    categoryY: CategoryY.CLOSED,
    options: {
      label: 'Requires has-label attribute on the host',
    },
  },
  {
    categoryX: CategoryX.DISABLED,
    categoryY: CategoryY.CLOSED,
    options: {
      label: standardLabel,
      disabled: true,
    },
  },
  {
    categoryX: CategoryX.EMPTY,
    categoryY: CategoryY.CLOSED,
    options: {
      label: standardLabel,
      allowEmptyValue: true,
    },
  },
  {
    categoryX: CategoryX.INPUT_BASED,
    categoryY: CategoryY.CLOSED,
    options: {
      label: standardLabel,
      allowEmptyValue: true,
    },
  },
  {
    categoryX: CategoryX.INPUT_BASED,
    categoryY: CategoryY.CLOSED,
    options: {
      label: standardLabel,
    },
  },
  {
    categoryX: CategoryX.PLACEHOLDER,
    categoryY: CategoryY.CLOSED,
    options: {
      label: standardLabel,
      withPlaceholder: true,
    },
  },
  {
    categoryX: CategoryX.LOADING,
    categoryY: CategoryY.CLOSED,
    options: {
      label: standardLabel,
      isLoading: true,
      withoutOptions: true,
    },
  },
  {
    categoryX: CategoryX.SELECTED,
    categoryY: CategoryY.CLOSED,
    options: {
      label: standardLabel,
      selectedValue: 'Green',
    },
  },
  {
    categoryX: CategoryX.TRUNCATED_LABEL,
    categoryY: CategoryY.CLOSED,
    options: {
      label:
        'very lengthy labels must be truncated very lengthy labels must be truncated',
    },
  },
  {
    categoryX: CategoryX.WITHOUT_OPTIONS,
    categoryY: CategoryY.CLOSED,
    options: {
      label: standardLabel,
      withoutOptions: true,
    },
  },
];

const openedSelectInputVariants: SelectInputVariant[] =
  closedSelectInputVariants.map((variant) => ({
    ...variant,
    categoryY: CategoryY.OPENED,
  }));

const Template: Story<unknown> = (): TemplateResult => {
  return html`${groups.map((group, index) =>
      variantsGroupTemplate(
        () =>
          generateVariantsMatrix(
            extendVariants(
              [...closedSelectInputVariants, ...openedSelectInputVariants],
              { options: { ...group.options } }
            ),
            ({
              categoryY,
              categoryX,
              options: {
                label,
                floatLabel,
                disabled,
                withoutOptions,
                isLoading,
                selectedValue,
                allowEmptyValue,
                withPlaceholder,
              },
            }) => html`
              <div class="${categoryY === CategoryY.OPENED ? 'opened' : ''}">
                <oryx-select
                  ?has-label=${!floatLabel}
                  ?floatLabel=${floatLabel}
                  ?isLoading=${isLoading}
                  label=${ifDefined(label)}
                >
                  ${when(
                    categoryX === CategoryX.CUSTOM_LABEL ||
                      categoryX === CategoryX.TRUNCATED_LABEL,
                    () => html`<span slot="label">${label}</span>`
                  )}
                  ${when(
                    categoryX === CategoryX.INPUT_BASED,
                    () => html`
                      <input placeholder="Select something from the list" />
                      ${when(
                        allowEmptyValue,
                        () => html`<oryx-option hidden></oryx-option>`
                      )}
                      ${selectOptions.map(
                        (option) => html`<oryx-option>${option}</oryx-option>`
                      )}
                    `,
                    () => html`
                      <select required ?disabled=${disabled}>
                        ${when(allowEmptyValue, () => html`<option></option>`)}
                        ${when(
                          withPlaceholder,
                          () =>
                            html`
                              <option value="" hidden>Select an option</option>
                            `
                        )}
                        ${!withoutOptions &&
                        selectOptions.map(
                          (option) =>
                            html`<option ?selected=${option === selectedValue}>
                              ${option}
                            </option>`
                        )}
                      </select>
                    `
                  )}
                </oryx-select>
              </div>
            `,
            { smallDisplayBreakpoint: storybookDefaultViewports.mobile.max }
          ),
        { title: group.title, addSeparator: index < groups.length - 1 }
      )
    )}

    <style>
      .opened oryx-select {
        --oryx-popover-visible: 1;
      }

      @media (min-width: ${storybookDefaultViewports.mobile.max}px) {
        td:not(:first-child) {
          width: 350px;
          max-width: 350px;
          vertical-align: baseline;
        }

        td:last-child {
          height: 210px;
        }
      }
      @media (max-width: ${storybookDefaultViewports.mobile.max}px) {
        td {
          max-width: 275px;
        }
        .opened {
          height: 200px;
        }
      }
    </style> `;
};

export const Variants = Template.bind({});

Variants.parameters = {
  chromatic: {
    delay: 300,
    viewports: [
      storybookDefaultViewports.mobile.min,
      storybookDefaultViewports.desktop.min,
    ],
  },
};

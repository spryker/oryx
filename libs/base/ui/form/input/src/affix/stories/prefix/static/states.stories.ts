import {
  generateVariantsMatrix,
  storybookDefaultViewports,
  VariantOptions,
  VariantsGroup,
  variantsGroupTemplate,
} from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../../../../.constants';
import {
  getInputVariants,
  InputVariantOptions,
  setInputMutationObserver,
} from '../../../../stories/static/common';

export default {
  title: `${storybookPrefix}/Form/Form Control/Prefix/Static`,
  parameters: { chromatic: { pauseAnimationAtEnd: true } },
} as Meta;

const groups: VariantsGroup<InputVariantOptions>[] = [
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
  {
    title: 'Truncated floating label',
    options: {
      floatLabel: true,
      label: 'Very loooong truncated text',
    },
  },
];

interface PrefixVariantOptions extends VariantOptions {
  prefixIcon?: string;
  prefixContent?: string;
  prefixFill?: boolean;
}

const subgroups: VariantsGroup<PrefixVariantOptions>[] = [
  {
    title: 'Icon prefix',
    options: {
      prefixIcon: 'search',
    },
  },
  {
    title: 'Content prefix',
    options: {
      prefixContent: 'more...',
    },
  },
  {
    title: 'Filled prefix icon',
    options: {
      prefixIcon: 'search',
      prefixFill: true,
    },
  },
  {
    title: 'Filled prefix content',
    options: {
      prefixContent: 'more...',
      prefixFill: true,
    },
  },
];

const Template: Story = (): TemplateResult => html`
  ${groups.map((group, index) =>
    variantsGroupTemplate(
      () => html` <div class="subgroups">
        ${subgroups.map(
          (subgroup) => html`
            <div>
              <h4>${subgroup.title}</h4>
              ${generateVariantsMatrix(
                [
                  ...getInputVariants({
                    label: 'Label',
                    ...group.options,
                    ...subgroup.options,
                  }),
                  ...getInputVariants({
                    value: 'Value',
                    label: 'Label',
                    ...group.options,
                    ...subgroup.options,
                  }),
                ],
                ({
                  options: {
                    label,
                    floatLabel,
                    errorMessage,
                    isDisabled,
                    className,
                    value,
                    prefixIcon,
                    prefixContent,
                    prefixFill,
                    hasError,
                  },
                }) => html`
                  <oryx-input
                    label=${label}
                    ?floatLabel=${floatLabel}
                    ?prefixFill=${prefixFill}
                    prefixIcon=${prefixIcon}
                    errormessage=${errorMessage}
                    ?hasError=${hasError}
                  >
                    ${when(
                      prefixContent,
                      () => html`<span slot="prefix">${prefixContent}</span>`
                    )}
                    <input
                      placeholder="Placeholder"
                      value=${value}
                      ?disabled=${isDisabled}
                      class=${className}
                    />
                  </oryx-input>
                `,
                { smallDisplayBreakpoint: storybookDefaultViewports.mobile.max }
              )}
            </div>
          `
        )}
      </div>`,
      { title: group.title, addSeparator: index < groups.length - 1 }
    )
  )}

  <script>
    ${setInputMutationObserver()};
  </script>

  <style>
    h4 {
      text-align: center;
    }
    .subgroups {
      display: flex;
      flex-wrap: wrap;
    }
  </style>
`;

export const States = Template.bind({});

States.parameters = {
  chromatic: {
    delay: 5000,
    viewports: [
      storybookDefaultViewports.mobile.min,
      storybookDefaultViewports.desktop.min,
    ],
  },
};

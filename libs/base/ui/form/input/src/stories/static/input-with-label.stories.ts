import {
  generateVariantsMatrix,
  VariantsGroup,
  variantsGroupTemplate,
} from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import '../../../index';
import {
  getInputVariants,
  InputVariantOptions,
  setInputMutationObserver,
} from './common';

export default {
  title: `${storybookPrefix}/Form/Input/Static`,
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

const Template: Story = (): TemplateResult => html`
  ${groups.map((group, index) =>
    variantsGroupTemplate(
      () => html`
        ${generateVariantsMatrix(
          [
            ...getInputVariants({ label: 'Label', ...group.options }),
            ...getInputVariants({
              value: 'Value',
              label: 'Label',
              ...group.options,
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
              hasError,
              required,
            },
          }) => html`
            <oryx-input
              label=${label}
              ?floatLabel=${floatLabel}
              ?hasError=${hasError}
              errormessage=${errorMessage}
            >
              <input
                placeholder="Placeholder"
                value=${value}
                ?required=${required}
                ?disabled=${isDisabled}
                class=${className}
              />
            </oryx-input>
          `
        )}
      `,
      { title: group.title, addSeparator: index < groups.length - 1 }
    )
  )}

  <script>
    ${setInputMutationObserver()};
  </script>
`;

export const WithLabel = Template.bind({});

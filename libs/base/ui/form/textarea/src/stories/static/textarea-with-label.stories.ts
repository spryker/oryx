import {
  generateVariantsMatrix,
  VariantsGroup,
  variantsGroupTemplate,
} from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import '../../../../input/src/form-control';
import {
  getInputVariants,
  InputVariantOptions,
} from '../../../../input/src/stories/static/common';
import { setTextAreaMutationObserver } from './common';

export default {
  title: `${storybookPrefix}/Form/Textarea/Static`,
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
            },
          }) => html`
            <oryx-input
              label=${label}
              ?floatLabel=${floatLabel}
              ?hasError=${hasError}
              errormessage=${errorMessage}
            >
              <textarea
                placeholder="Placeholder"
                ?disabled=${isDisabled}
                class=${className}
              >
${value}</textarea
              >
            </oryx-input>
          `
        )}
      `,
      { title: group.title, addSeparator: index < groups.length - 1 }
    )
  )}

  <script>
    ${setTextAreaMutationObserver()};
  </script>
`;
export const StatesWithLabel = Template.bind({});

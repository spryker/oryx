import { generateVariantsMatrix } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import '../../form-control';
import { getInputVariants, setInputMutationObserver } from './common';

export default {
  title: `${storybookPrefix}/Form/Input/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    ${generateVariantsMatrix(
      [...getInputVariants(), ...getInputVariants({ value: 'Value' })],
      ({
        options: { errorMessage, isDisabled, className, value, hasError },
      }) => html`
        <oryx-input ?hasError=${hasError} errormessage=${errorMessage}>
          <input
            placeholder="Placeholder"
            value=${value}
            ?disabled=${isDisabled}
            class=${className}
          />
        </oryx-input>
      `
    )}

    <script>
      ${setInputMutationObserver()};
    </script>
  `;
};
export const WithoutLabel = Template.bind({});

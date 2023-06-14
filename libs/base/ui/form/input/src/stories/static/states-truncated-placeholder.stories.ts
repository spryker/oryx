import { generateVariantsMatrix } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import '../../form-control';
import { getInputVariants, setInputMutationObserver } from './common';

export default {
  title: `${storybookPrefix}/Form/Input/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    ${generateVariantsMatrix(
      getInputVariants(),
      ({
        options: { hasError, errorMessage, isDisabled, className, value },
      }) => html`
        <oryx-input
          label="Label"
          ?hasError=${hasError}
          errormessage=${errorMessage}
        >
          <input
            placeholder="Very long truncated placeholder"
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
export const TruncatedPlaceholder = Template.bind({});

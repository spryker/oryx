import { generateVariantsMatrix } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import '../../../../input/src/form-control';
import { getInputVariants } from '../../../../input/src/stories/static/common';
import { setTextAreaMutationObserver } from './common';

export default {
  title: `${storybookPrefix}/Form/Textarea/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    ${generateVariantsMatrix(
      [...getInputVariants(), ...getInputVariants({ value: 'Value' })],
      ({
        options: { hasError, errorMessage, isDisabled, className, value },
      }) => html`
        <oryx-input ?hasError=${hasError} errormessage=${errorMessage}>
          <textarea
            placeholder="Placeholder"
            value=${value}
            ?disabled=${isDisabled}
            class=${className}
          ></textarea>
        </oryx-input>
      `
    )}

    <script>
      ${setTextAreaMutationObserver()};
    </script>
  `;
};
export const StatesWithoutLabel = Template.bind({});

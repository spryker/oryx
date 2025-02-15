import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Utilities/ErrorMessage`,
} as Meta;

interface Props {
  message: string;
}

const Template: Story<Props> = ({ message }: Props): TemplateResult => {
  return html`<oryx-error-message .message=${message}> </oryx-error-message>`;
};
export const ErrorMessages = Template.bind({});
ErrorMessages.args = { message: 'Error validation text' };

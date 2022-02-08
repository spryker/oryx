import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../index';

export default {
  title: `${storybookPrefix}/form/utilities/ErrorMessage`,
} as Meta;

interface Props {
  message: string;
}

const Template: Story<Props> = ({ message }: Props): TemplateResult => {
  return html` <oryx-error-message .message=${message}> </oryx-error-message> `;
};
export const ErrorMessages = Template.bind({});
ErrorMessages.args = { message: 'Error validation text' };

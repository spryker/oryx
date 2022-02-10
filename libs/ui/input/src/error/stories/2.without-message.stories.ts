import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../constant';
import '../../../index';
import { Props } from './model';

export default {
  title: `${storybookPrefix}/form/form-control/error`,
} as Meta;

const Template: Story<Props> = ({
  value,
  placeholder,
  label,
  disabled,
  readonly,
}: Props): TemplateResult => {
  return html`
<oryx-input .options=${{ label }} class="has-error">
    <input placeholder=${placeholder} value=${value} ?disabled=${disabled} ?readonly=${readonly}></input>
</oryx-input>
`;
};
export const WithoutMessage = Template.bind({});
WithoutMessage.args = {
  disabled: false,
  readonly: false,
  placeholder: 'Fill in some data...',
  label: 'Without error message',
  value: '',
};

import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../constant';
import '../../index';

export default {
  title: `${storybookPrefix}/form/form-control`,
} as Meta;

interface Props {
  label: string;
}

const Template: Story<Props> = ({ label }: Props): TemplateResult => {
  return html` <oryx-input label=${label}>
    <input placeholder="placeholder..." />
  </oryx-input>`;
};
export const Label = Template.bind({});

Label.args = {
  label: 'label',
};

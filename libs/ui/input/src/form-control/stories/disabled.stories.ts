import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../constant';
import '../index';

export default {
  title: `${storybookPrefix}/form/form-control`,
} as Meta;

interface Props {
  disabled: boolean;
}

const Template: Story<Props> = ({ disabled }: Props): TemplateResult => {
  return html`
    <oryx-input label="label">
      <oryx-icon slot="prefix" type="search"></oryx-icon>
      <input placeholder="Placeholder..." ?disabled=${disabled} />
    </oryx-input>
  `;
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

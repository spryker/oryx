import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../constant';
import '../../index';

export default {
  title: `${storybookPrefix}/form/form-control/prefix`,
} as Meta;
interface Props {
  disabled: boolean;
  styleClass: string;
}

const Template: Story<Props> = ({
  disabled,
  styleClass,
}: Props): TemplateResult => {
  return html`
    <oryx-input class=${styleClass}>
      <input placeholder="Placeholder..." ?disabled=${disabled} />
      <oryx-icon slot="prefix" type="search"></oryx-icon>
      <span slot="prefix">more...</span>
    </oryx-input>
  `;
};
export const PrefixContent = Template.bind({});
PrefixContent.args = {
  disabled: false,
  styleClass: 'prefix-fill',
};

import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../constant';
import '../../index';

export default {
  title: `${storybookPrefix}/form/form-control/suffix`,
} as Meta;
interface Props {
  disabled: boolean;
  styleClass: string;
}

const Template: Story<Props> = ({
  styleClass,
  disabled,
}: Props): TemplateResult => {
  return html`
<oryx-input class=${styleClass}>
  <input placeholder="Placeholder..." ?disabled=${disabled}></input>
  <oryx-icon slot="suffix" type="search"></oryx-icon>
  <span slot="suffix">more...</span>
</oryx-input>
      `;
};
export const SuffixContent = Template.bind({});
SuffixContent.args = {
  styleClass: 'suffix-fill',
  disabled: false,
};

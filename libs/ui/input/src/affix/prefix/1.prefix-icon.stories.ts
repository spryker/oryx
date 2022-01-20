import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../../index';
import { Props } from '../../stories/model';

export default {
  title: 'form/input/prefixed',
} as Meta;

const Template: Story<Props> = ({
  prefixIcon,
  prefixFill,
  disabled,
}: Props): TemplateResult => {
  return html`
    <oryx-input
      .prefixIcon=${prefixIcon}
      class=${prefixFill ? 'prefix-fill' : ''}
    >
      <input placeholder="Placeholder..." ?disabled=${disabled} />
    </oryx-input>
  `;
};
export const PrefixIcon = Template.bind({});
PrefixIcon.args = {
  prefixIcon: 'search',
  prefixFill: false,
  disabled: false,
};

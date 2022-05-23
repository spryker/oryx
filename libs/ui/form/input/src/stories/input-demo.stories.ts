import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import '../index';

export default {
  title: `${storybookPrefix}/Form/Input`,
} as Meta;

interface Props {
  disabled: boolean;
  type: string;
}

const Template: Story<Props> = ({ disabled, type }: Props): TemplateResult => {
  return html`
    <oryx-input>
      <input placeholder="Placeholder..." ?disabled=${disabled} type=${type} />
    </oryx-input>
  `;
};
export const InputDemo = Template.bind({});
InputDemo.args = {
  disabled: false,
  type: 'text',
};

InputDemo.argTypes = {
  type: {
    options: ['text', 'number'],
    control: { type: 'select' },
  },
};

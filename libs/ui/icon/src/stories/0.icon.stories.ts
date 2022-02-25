import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../constant';
import { IconProperties, IconTypes } from '../icon.model';
import '../index';

export default { title: `${storybookPrefix}/Icon` } as Meta;

interface Props extends IconProperties {
  color: string;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <oryx-icon style="color: ${props.color}" type=${props.type}></oryx-icon>
  `;
};

export const Icon = Template.bind({});

Icon.argTypes = {
  type: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
    defaultValue: IconTypes.Add,
  },
  color: {
    control: { type: 'color' },
  },
};

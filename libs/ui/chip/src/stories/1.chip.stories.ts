import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { ChipType } from '../..';
import { storybookPrefix } from '../../../constant';
import '../index';

export default { title: `${storybookPrefix}/Chip` } as Meta;

export interface ChipProperties {
  type?: ChipType;
}

const Template: Story<ChipProperties> = (
  props: ChipProperties
): TemplateResult => {
  return html`
    <oryx-chip .type=${props.type}> Text <b>content</b> </oryx-chip>
  `;
};

export const ChipDemo = Template.bind({});

ChipDemo.argTypes = {
  type: {
    control: { type: 'radio' },
    options: Object.values(ChipType),
  },
};

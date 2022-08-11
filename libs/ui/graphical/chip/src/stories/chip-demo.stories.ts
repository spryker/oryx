import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { chipComponent, ChipType } from '../../index';

useComponent(chipComponent);

export default { title: `${storybookPrefix}/Graphical/Chip` } as Meta;

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

ChipDemo.parameters = {
  chromatic: { disableSnapshot: true },
};

ChipDemo.argTypes = {
  type: {
    options: Object.values(ChipType),
    control: { type: 'radio' },
  },
};

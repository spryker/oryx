import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Structure/Tile`,
  argTypes: {
    selected: {
      description: 'Tile selected',
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

interface Props {
  selected?: boolean;
}

const Template: Story<Props> = ({ selected }: Props): TemplateResult => {
  return html`
    <oryx-tile ?selected=${selected}><a href="/">Tile</a></oryx-tile>
  `;
};

export const TileDemo = Template.bind({});

TileDemo.args = {
  selected: false,
};

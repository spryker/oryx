import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { tileComponent } from '../index';

useComponent(tileComponent);

export default {
  title: `${storybookPrefix}/Structure/Tile`,
  argTypes: {
    selected: {
      description: 'Tile selected',
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

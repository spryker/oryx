import { OverlaysDecorator } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { Position } from '../../dropdown.model';
import '../utils';

export default {
  title: `${storybookPrefix}/Overlays/Dropdown/Static`,
  decorators: [OverlaysDecorator(800, 600)],
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <container-component
      .positions=${[Position.START, Position.CENTER, Position.END]}
      vertical
    ></container-component>
  `;
};

export const VerticalOriented = Template.bind({});
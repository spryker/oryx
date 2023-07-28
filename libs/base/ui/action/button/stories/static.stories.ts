import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ButtonColor } from '../button.model';
import { staticButtons } from './util';

export default {
  title: `${storybookPrefix}/Actions/Button/Static`,
} as Meta;

const PrimaryTemplate: Story = (): TemplateResult => {
  return staticButtons(ButtonColor.Primary);
};

export const Types = PrimaryTemplate.bind({});

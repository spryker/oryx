import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.storybook/constant';
import '../../index';
import { getModal } from './common';

export default {
  title: `${storybookPrefix}/Overlays/Modal/Interaction`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return getModal(true);
};

export const Open = Template.bind({});

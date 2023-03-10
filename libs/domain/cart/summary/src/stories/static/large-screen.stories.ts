import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { getTemplate } from './common';

export default {
  title: `${storybookPrefix}/Summary/Static`,
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult =>
  getTemplate(['empty', 'multiple', 'large']);

export const LargeScreen = Template.bind({});

LargeScreen.parameters = {
  chromatic: {
    delay: 3000,
  },
};

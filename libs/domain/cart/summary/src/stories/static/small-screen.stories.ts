import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { getTemplate } from './common';

export default {
  title: `${storybookPrefix}/Summary/Static`,
  parameters: {
    chromatic: { viewports: [320, 1200] },
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult =>
  getTemplate(['empty', 'multiple', 'large']);

export const SmallScreen = Template.bind({});

SmallScreen.parameters = {
  chromatic: {
    delay: 3000,
  },
};

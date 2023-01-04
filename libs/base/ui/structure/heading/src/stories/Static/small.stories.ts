import { Meta } from '@storybook/web-components';
import { storybookPrefix } from '../../../../../.constants';
import { Template } from './template';

export default {
  title: `${storybookPrefix}/Structure/Heading/Static`,
  chromatic: { viewports: [414, 896] },
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
} as Meta;

export const SmallScreen = Template.bind({});

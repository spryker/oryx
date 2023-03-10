import { Meta } from '@storybook/web-components';
import { storybookPrefix } from '../../../../../.constants';
import { Template } from './template';

export default {
  title: `${storybookPrefix}/Structure/Heading/Static`,
  parameters: {
    chromatic: { delay: 1000, viewports: [414, 896] },
    viewport: {
      defaultViewport: 'tablet',
    },
  },
} as Meta;

export const MediumScreen = Template.bind({});

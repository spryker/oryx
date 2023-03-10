import { Meta } from '@storybook/web-components';
import { Template } from '../../../../../../../../dist/libs/base/ui/structure/heading/src/stories/Static/template';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Structure/Heading/Static`,
  parameters: { chromatic: { delay: 3000 } },
} as Meta;

export const LargeScreen = Template.bind({});

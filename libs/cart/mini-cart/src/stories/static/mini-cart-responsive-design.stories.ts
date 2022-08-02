import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { setupCartMocks } from '../../../../src/mocks/cart.mock';
import '../../index';
import { getTemplate } from './common';

export default {
  title: `${storybookPrefix}/Mini cart/Static`,
  loaders: [setupCartMocks],
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => getTemplate();

export const MiniCartResponsiveDesign = Template.bind({});

MiniCartResponsiveDesign.parameters = {
  chromatic: { viewports: [320, 1200] },
  viewport: {
    defaultViewport: 'mobile1',
  },
};

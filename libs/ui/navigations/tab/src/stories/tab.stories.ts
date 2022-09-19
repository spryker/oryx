import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { tabComponent } from '../index';

useComponent(tabComponent);

export default {
  title: `${storybookPrefix}/Navigations/Tab`,
  args: {},
  argTypes: {},
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html` <oryx-tab> tab content </oryx-tab> `;
};

// export const TabDemo = Template.bind({});

import { storybookDefaultViewports } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit';
import { TemplateResult } from 'lit/development';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Picking lists`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html` <oryx-picking-lists></oryx-picking-lists> `;
};

export const Demo = Template.bind({});

Demo.parameters = {
  chromatic: {
    viewports: [storybookDefaultViewports.mobile.min],
  },
};

import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Picking in progress modal`,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<oryx-picking-in-progress-modal
    open
  ></oryx-picking-in-progress-modal> `;
};

export const Demo = Template.bind({});

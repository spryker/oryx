import { OverlaysDecorator } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Picking In Progress Modal`,
  decorators: [OverlaysDecorator()],
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<oryx-picking-in-progress-modal
    open
  ></oryx-picking-in-progress-modal> `;
};

export const Demo = Template.bind({});

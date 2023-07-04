import { OverlaysDecorator } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Discard modal`,
  decorators: [OverlaysDecorator()],
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html` <oryx-discard-modal open></oryx-discard-modal> `;
};

export const Demo = Template.bind({});

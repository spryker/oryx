import { OverlaysDecorator } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/User Profile`,
  decorators: [OverlaysDecorator()],
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<oryx-picking-user-profile></oryx-picking-user-profile>`;
};

export const Demo = Template.bind({});

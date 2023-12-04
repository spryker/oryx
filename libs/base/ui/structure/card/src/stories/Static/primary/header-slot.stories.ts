import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../../.constants';

export default {
  title: `${storybookPrefix}/Structure/Card/Static/Primary`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-card>
      <oryx-heading slot="heading" tag="h5">header</oryx-heading>
      <div>content slot</div>
      <div slot="footer">footer slot</div>
    </oryx-card>
  `;
};

export const HeaderSlot = Template.bind({});

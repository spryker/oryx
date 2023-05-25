import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../../.constants';

export default {
  title: `${storybookPrefix}/Structure/Card/Static/Primary`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-card>
      <oryx-icon .type=${IconTypes.Rocket} slot="heading"></oryx-icon>
      <oryx-heading slot="heading">
        <h5>header</h5>
      </oryx-heading>
      <div>content slot</div>
      <div slot="footer">footer slot</div>
    </oryx-card>
  `;
};

export const HeaderIcon = Template.bind({});

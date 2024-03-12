import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Navigations/Tabs/Static`,
  args: {},
  argTypes: {},
} as Meta;

interface Props {
  [key: string]: string;
}

const Template: Story<Props> = (): TemplateResult => {
  return html`
    <h3>Primary tab</h3>

    <oryx-tabs appearance="primary">
      <oryx-tab>Tab 1</oryx-tab>
      <div slot="panels">Сontent for primary tab 1</div>
    </oryx-tabs>

    <h3>Secondary tab</h3>

    <oryx-tabs appearance="secondary">
      <oryx-tab>Tab 1</oryx-tab>
      <div slot="panels">Сontent for secondary tab 1</div>
    </oryx-tabs>
  `;
};

export const SingleTab = Template.bind({});

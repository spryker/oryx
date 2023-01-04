import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Address Form/Static`,
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<oryx-address-form country="US"></oryx-address-form>`;
};

export const US = Template.bind({});

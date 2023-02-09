import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Utilities/Option`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-option>option</oryx-option>
    <oryx-option selected>option</oryx-option>
    <oryx-option>option</oryx-option>
    <oryx-option>option</oryx-option>
    <oryx-option>option</oryx-option>
    <oryx-option>option</oryx-option>
    <oryx-option>option</oryx-option>
    <oryx-option>option</oryx-option>
  `;
};

export const Option = Template.bind({});

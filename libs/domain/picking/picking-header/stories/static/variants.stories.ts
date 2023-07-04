import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Picking header/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<h4>With cart note</h4>
    <oryx-picking-header pickingListId="withCartNote"></oryx-picking-header>

    <h4>Without cart note</h4>
    <oryx-picking-header
      pickingListId="withoutCartNote"
    ></oryx-picking-header>`;
};

export const Variants = Template.bind({});

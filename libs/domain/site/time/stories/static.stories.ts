import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { SiteTimeComponentAttributes } from '../time.model';

export default {
  title: `${storybookPrefix}/time`,
} as Meta;

const Template: Story<SiteTimeComponentAttributes> = (
  props: SiteTimeComponentAttributes
): TemplateResult => {
  return html`<oryx-site-time
      .stamp=${'Fri Dec 08 2023 16:52:54 GMT+0100'}
    ></oryx-site-time>
    <oryx-site-time
      .stamp=${'Fri Dec 08 2023 02:52:54 GMT+0100'}
    ></oryx-site-time>
    <oryx-site-time
      .stamp=${'Fri Dec 08 2023 08:52:54 GMT+0100'}
      .i18nToken=${'before-<time>-after'}
    ></oryx-site-time>

    <style>
      oryx-site-time {
        display: block;
      }
    </style> `;
};

export const Static = Template.bind({});

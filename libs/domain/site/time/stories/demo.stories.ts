import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { SiteTimeComponentAttributes } from '../time.model';

export default {
  title: `${storybookPrefix}/time`,
  args: {
    stamp: new Date().toString(),
    i18nToken: 'before-<time>-after',
  },
  argTypes: {
    i18nToken: { control: { type: 'text' } },
  },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const Template: Story<SiteTimeComponentAttributes> = (
  props: SiteTimeComponentAttributes
): TemplateResult => {
  return html`<oryx-site-time
    .stamp=${props.stamp}
    .i18nToken=${props.i18nToken}
  ></oryx-site-time>`;
};

export const Demo = Template.bind({});

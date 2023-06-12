import { getAppIcons } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../.constants';
import { CardType } from '../card.model';

export default { title: `${storybookPrefix}/Structure/Card` } as Meta;

export interface CardProperties {
  type?: CardType;
  icon?: string;
  heading?: string;
  body?: string;
  footer?: string;
}

const Template: Story<CardProperties> = (
  props: CardProperties
): TemplateResult => {
  return html`
    <oryx-card .type=${props.type}>
      ${when(
        props.icon,
        () => html`<oryx-icon .type=${props.icon} slot="heading"></oryx-icon>`
      )}
      ${when(
        props.heading,
        () => html` <oryx-heading slot="heading">
          <h5>${props.heading}</h5>
        </oryx-heading>`
      )}

      <div>${props.body}</div>
      ${when(
        props.footer,
        () => html`<div slot="footer">${props.footer}</div>`
      )}
    </oryx-card>
  `;
};

export const CardDemo = Template.bind({});

CardDemo.args = {
  heading: 'header',
  body: 'content',
};
CardDemo.argTypes = {
  type: {
    control: { type: 'select' },
    options: Object.values(CardType),
  },
  heading: {
    control: { type: 'text' },
  },
  body: {
    control: { type: 'text' },
  },
  icon: {
    options: getAppIcons(),
    control: { type: 'select' },
  },
  footer: {
    control: { type: 'text' },
  },
};

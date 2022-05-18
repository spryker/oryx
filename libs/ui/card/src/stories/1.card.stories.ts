import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { CardType } from '../..';
import { storybookPrefix } from '../../../.constants';
import { IconTypes } from '../../../Graphical/icon';

export default { title: `${storybookPrefix}/Structure/Card` } as Meta;

export interface CardProperties {
  type?: CardType;
  icon?: string;
  header?: string;
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
        () => html`<oryx-icon .type=${props.icon} slot="header"></oryx-icon>`
      )}
      <h1 slot="header">${props.header}</h1>
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
  header: 'header',
  body: 'content',
};
CardDemo.argTypes = {
  type: {
    control: { type: 'select' },
    options: Object.values(CardType),
  },
  header: {
    control: { type: 'text' },
  },
  body: {
    control: { type: 'text' },
  },
  icon: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
  },
  footer: {
    control: { type: 'text' },
  },
};

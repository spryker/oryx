import { getAppIcons } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../.constants';
import { ActionComponentAttributes, ButtonType } from '../action.model';

export default {
  title: `${storybookPrefix}/Actions/Action`,
  args: {
    text: 'Action',
    // type: ButtonType.Outline,
    //     linkType: LinkType.Link,
    //     disabled: false,
    //     singleLine: false,
    //     icon: undefined,
    //     color: 'primary',
  },
  argTypes: {
    type: {
      options: [ButtonType.Solid, ButtonType.Outline, ButtonType.Icon],
      control: { type: 'select' },
    },
    icon: {
      options: getAppIcons(),
      control: { type: 'select' },
    },
    slotted: {
      options: ['link', 'button', 'content'],
      control: { type: 'select' },
      table: { category: 'demo' },
    },
    href: {
      control: { type: 'text' },
      table: { category: 'demo' },
    },
    //   color: {
    //     control: { type: 'select', options: ['primary', 'neutral'] },
    //   },
  },
} as Meta;

interface Props {
  text: string;
  href: string;
  slotted: 'link' | 'button' | 'content';
}

const Template: Story<ActionComponentAttributes & Props> = (
  props
): TemplateResult => {
  let template;

  if (props.slotted === 'content') {
    template = html`
      ${when(
        props.icon,
        () => html`<oryx-icon .type=${props.icon}></oryx-icon>`
      )}
      ${props.text}
    `;
  }

  if (props.slotted === 'link') {
    template = html`
      <a href=${props.href}>
        ${when(
          props.icon,
          () => html`<oryx-icon .type=${props.icon}></oryx-icon>`
        )}
        ${props.text}
      </a>
    `;
  }

  if (props.slotted === 'button') {
    template = html`
      <button>
        ${when(
          props.icon,
          () => html`<oryx-icon .type=${props.icon}></oryx-icon>`
        )}
        ${props.text}
      </button>
    `;
  }
  return html`
    <oryx-action
      .color=${props.color}
      .type=${props.type}
      .label=${props.text}
      .icon=${props.icon}
      .href=${props.href}
      ?custom=${props.slotted === 'link' || props.slotted === 'button'}
      >${template}</oryx-action
    >
  `;
};

export const Demo = Template.bind({});

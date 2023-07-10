import { getAppIcons } from '@/tools/storybook';
import { Size } from '@spryker-oryx/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../.constants';
import { ActionComponentAttributes, ButtonType } from '../action.model';

export default {
  title: `${storybookPrefix}/Actions/Action`,
  args: {
    text: 'Action',
    //     linkType: LinkType.Link,
    //     disabled: false,
    //     singleLine: false,
    //     icon: undefined,
    //     link: '/?path=/story/ui-actions-link--link-demo',
    //     color: 'primary',
  },
  argTypes: {
    //   linkType: {
    //     options: [LinkType.Link, LinkType.ExternalLink],
    //     control: { type: 'select' },
    //   },
    icon: {
      options: getAppIcons(),
      control: { type: 'select' },
    },
    //   link: {
    //     control: { type: 'text' },
    //     table: { category: 'demo' },
    //   },
    //   color: {
    //     control: { type: 'select', options: ['primary', 'neutral'] },
    //   },
  },
} as Meta;

interface Props {
  link: string;
}

interface ButtonProps {
  text?: string;
  type?: ButtonType;
  size?: Size;
  icon?: string;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  slotted?: 'content' | 'link' | 'button';
  href?: string;
}

const renderButton = (props: ButtonProps) => {
  let template;
  const label = props.slotted ? undefined : props.text;
  const icon = props.slotted ? undefined : props.icon;
  const href = props.slotted === 'link' ? undefined : props.href;

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
      .type=${props.type}
      .size=${props.size}
      .label=${label}
      .icon=${icon}
      .href=${href}
      ?custom=${props.slotted === 'link' || props.slotted === 'button'}
      ?loading=${props.loading}
      >${template}</oryx-action
    >
  `;
};

const sizes = [Size.Lg, Size.Md, Size.Sm];
const colors: string[] = []; //['primary']; //, 'neutral', 'error', 'info']; //[ 'primary', 'error']; //, 'secondary']
const text = 'Button';
const icon = 'rocket';
const href = 'http://spryker.com';
const loading = true;

const renderButtons = (label: string, props: ButtonProps) => html`
  <span>${label}</span>
  ${[
    renderButton({ ...props, text }),
    renderButton({ ...props, text, icon }),
    renderButton({ ...props, icon }),
    renderButton({ ...props, type: ButtonType.Outline, text }),
    renderButton({ ...props, type: ButtonType.Outline, text, icon }),
    renderButton({ ...props, type: ButtonType.Outline, icon }),
    renderButton({ ...props, type: ButtonType.Icon, icon }),
    renderButton({ ...props, type: ButtonType.Icon, icon, text }),
  ]}
`;

const Template: Story<ActionComponentAttributes & Props> = (
  props
): TemplateResult => {
  const onClick = () => {
    console.log('click event');
  };

  return html`
    <section @click=${onClick}>
      <span></span>
      <span style="grid-column: 2 / span 3">Solid (default)</span>
      <span style="grid-column: 5 / span 3">Outline</span>
      <span style="grid-column: 8 / -1">Icon</span>
      <span style="grid-column: 2">Text only</span>
      <span>With icon</span>
      <span>Icon only</span>
      <span>Icon</span>
      <span>Medium</span>
      <span>Small</span>
      <span>Large</span>
      <span>Medium</span>

      <h3 style="grid-column: 1 / -1">Button properties</h3>
      ${sizes.map((size) => html`${renderButtons(size, { size })}`)}
      ${renderButtons('loading', { loading })}

      <h3 style="grid-column: 1 / -1">Link properties</h3>
      ${sizes.map((size) => html`${renderButtons(size, { size, href })}`)}
      ${renderButtons('loading', { loading, href })}

      <h3 style="grid-column: 1 / -1">Slotted content</h3>
      ${sizes.map(
        (size) => html`${renderButtons(size, { size, slotted: 'content' })}`
      )}
      ${renderButtons('loading', { loading, slotted: 'content' })}

      <h3 style="grid-column: 1 / -1">
        Slotted link with content in light dom
      </h3>
      ${sizes.map(
        (size) => html`${renderButtons(size, { size, slotted: 'link' })}`
      )}
      ${renderButtons('loading', { loading, slotted: 'link' })}

      <h3 style="grid-column: 1 / -1">
        Slotted link with content in light dom
      </h3>
      ${sizes.map(
        (size) => html`${renderButtons(size, { size, slotted: 'button' })}`
      )}
      ${renderButtons('loading', { loading, slotted: 'button' })}
    </section>

    <style>
      section {
        display: grid;
        grid-template-columns: repeat(9, max-content);
        gap: 10px;
        justify-items: start;
        align-items: center;
        padding-block: 10px;
        background: lightblue;
      }

      section span {
        display: flex;
        gap: 10px;
      }
    </style>
  `;
};

export const ActionDemo = Template.bind({});

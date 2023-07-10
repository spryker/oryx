import { Size } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { ButtonColor, ButtonType } from '../action.model';

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
      .color=${props.color}
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

const text = 'Button';
const icon = 'rocket';
const sizes = [Size.Lg, Size.Md, Size.Sm];
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

const onClick = () => {
  console.log('click event');
};

export const staticButtons = (color: ButtonColor): TemplateResult => html`
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
    ${sizes.map((size) => html`${renderButtons(size, { size, color })}`)}
    ${renderButtons('loading', { loading, color })}

    <h3 style="grid-column: 1 / -1">Link properties</h3>
    ${sizes.map((size) => html`${renderButtons(size, { size, color, href })}`)}
    ${renderButtons('loading', { loading, color, href })}

    <h3 style="grid-column: 1 / -1">Slotted content</h3>
    ${sizes.map(
      (size) =>
        html`${renderButtons(size, { size, color, slotted: 'content' })}`
    )}
    ${renderButtons('loading', { loading, color, slotted: 'content' })}

    <h3 style="grid-column: 1 / -1">Slotted link with content in light dom</h3>
    ${sizes.map(
      (size) => html`${renderButtons(size, { size, color, slotted: 'link' })}`
    )}
    ${renderButtons('loading', { loading, color, slotted: 'link' })}

    <h3 style="grid-column: 1 / -1">
      Slotted button with content in light dom
    </h3>
    ${sizes.map(
      (size) => html`${renderButtons(size, { size, color, slotted: 'button' })}`
    )}
    ${renderButtons('loading', { loading, color, slotted: 'button' })}
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

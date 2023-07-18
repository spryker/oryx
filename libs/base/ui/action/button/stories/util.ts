import { Size } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { ButtonColor, ButtonSize, ButtonType } from '../button.model';

interface ButtonProps {
  text?: string;
  type?: ButtonType;
  size?: ButtonSize;
  icon?: string;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  confirmed?: boolean;
  slotted?: 'content' | 'link' | 'button';
  href?: string;
}

export const renderButton = (props: ButtonProps): TemplateResult => {
  let template;
  const text = props.slotted ? undefined : props.text;
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
      <a href=${props.href ?? 'https://spryker.com'}>
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
    <oryx-button
      .type=${props.type}
      .color=${props.color}
      .size=${props.size}
      .text=${text}
      .icon=${icon}
      .href=${href}
      ?custom=${props.slotted === 'link' || props.slotted === 'button'}
      ?disabled=${props.disabled}
      ?loading=${props.loading}
      ?confirmed=${props.confirmed}
      >${template}</oryx-button
    >
  `;
};

const text = 'Button';
const icon = 'rocket';
const href = 'http://spryker.com';
const disabled = true;
const loading = true;
const confirmed = true;

export const renderButtons = (
  label: string,
  props: ButtonProps
): TemplateResult => html`
  <span>${label}</span>
  ${[
    renderButton({ ...props, text }),
    renderButton({ ...props, text, icon }),
    renderButton({ ...props, icon }),
    renderButton({ ...props, type: ButtonType.Outline, text }),
    renderButton({ ...props, type: ButtonType.Outline, text, icon }),
    renderButton({ ...props, type: ButtonType.Outline, icon }),
    renderButton({ ...props, type: ButtonType.Text, text }),
    renderButton({ ...props, type: ButtonType.Text, text, icon }),
    renderButton({ ...props, type: ButtonType.Icon, icon }),
    renderButton({ ...props, type: ButtonType.Icon, icon, text }),
  ]}
`;

const onClick = () => {
  console.log('click event');
};

export const staticButtons = (
  color: ButtonColor,
  sizes = [ButtonSize.Lg, ButtonSize.Md, ButtonSize.Sm]
): TemplateResult => html`
  <section @click=${onClick}>
    <span></span>
    <span style="grid-column: 2 / span 3">Solid (default)</span>
    <span style="grid-column: 5 / span 3">Outline</span>
    <span style="grid-column: 8 / span 2">Text</span>
    <span style="grid-column: 10 / -1">Icon</span>
    <span style="grid-column: 2">Text only</span>
    <span>With icon</span>
    <span>Icon only</span>
    <span>Icon</span>
    <span>Medium</span>
    <span>Small</span>
    <span>Text</span>
    <span>Text and icon</span>
    <span>Large</span>
    <span>Medium</span>

    <h3 style="grid-column: 1 / -1">Button properties</h3>
    ${sizes.map((size) => html`${renderButtons(size, { size, color })}`)}
    ${renderButtons('disabled', { disabled, size: ButtonSize.Lg, color })}
    ${renderButtons('loading', { loading, color })}
    ${renderButtons('confirmed', { confirmed, color })}

    <h3 style="grid-column: 1 / -1">Link properties</h3>
    ${sizes.map((size) => html`${renderButtons(size, { size, color, href })}`)}
    ${renderButtons('disabled', { disabled, size: ButtonSize.Lg, color, href })}
    ${renderButtons('loading', { loading, color, href })}
    ${renderButtons('confirmed', { confirmed, color, href })}

    <h3 style="grid-column: 1 / -1">Slotted content</h3>
    ${sizes.map(
      (size) =>
        html`${renderButtons(size, { size, color, slotted: 'content' })}`
    )}
    ${renderButtons('disabled', {
      disabled,
      size: ButtonSize.Lg,
      color,
      slotted: 'content',
    })}
    ${renderButtons('loading', { loading, color, slotted: 'content' })}
    ${renderButtons('confirmed', { confirmed, color, slotted: 'content' })}

    <h3 style="grid-column: 1 / -1">Slotted link with content in light dom</h3>
    ${sizes.map(
      (size) => html`${renderButtons(size, { size, color, slotted: 'link' })}`
    )}
    ${renderButtons('disabled', {
      disabled,
      size: ButtonSize.Lg,
      color,
      slotted: 'link',
    })}
    ${renderButtons('loading', { loading, color, slotted: 'link' })}
    ${renderButtons('confirmed', { confirmed, color, slotted: 'link' })}

    <h3 style="grid-column: 1 / -1">
      Slotted button with content in light dom
    </h3>
    ${sizes.map(
      (size) => html`${renderButtons(size, { size, color, slotted: 'button' })}`
    )}
    ${renderButtons('disabled', {
      disabled,
      size: ButtonSize.Lg,
      color,
      slotted: 'button',
    })}
    ${renderButtons('loading', { loading, color, slotted: 'button' })}
    ${renderButtons('confirmed', { confirmed, color, slotted: 'button' })}
  </section>

  <style>
    section {
      display: grid;
      grid-template-columns: repeat(11, max-content);
      gap: 10px;
      justify-items: start;
      align-items: center;
      padding-block: 10px;
    }

    section span {
      display: flex;
      gap: 10px;
    }
  </style>
`;

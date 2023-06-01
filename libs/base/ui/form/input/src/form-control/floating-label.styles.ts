import { screenCss } from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';

const floatingLabelStyles = (attribute = true) => {
  const floatLabel = unsafeCSS(
    attribute ? '[floatLabel]' : ':not([floatDisabled])'
  );
  return css`
    :host(${floatLabel}) label {
      position: relative;
    }

    :host(${floatLabel}) slot[name='label']::slotted(*) {
      pointer-events: none;
    }

    :host(${floatLabel}) slot[name='label'] {
      text-transform: none;
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: var(--oryx-color-neutral-9);
      position: absolute;
      inset-block-start: min(calc(50% - 0.5em), 17px);
      inset-inline-start: calc(var(--float-label-start-gap, 0px) + 13px);
      max-width: calc(100% - 26px - var(--float-label-start-gap, 0px));
      z-index: 1;
      transition: 100ms;
      /* stylelint-disable-next-line */
      background: linear-gradient(
        to bottom,
        transparent 10px,
        var(--_label-background-color) 10px
      );
    }

    :host(oryx-select${floatLabel}) slot[name='label'] {
      max-width: calc(100% - 54px - var(--float-label-start-gap, 0px));
    }

    :host(${floatLabel}),
    :host(${floatLabel}) ::slotted(select:invalid) {
      --oryx-color-placeholder: transparent;
    }

    :host(${floatLabel}) slot[name='label'],
    :host(${floatLabel}) slot[name='label']::slotted(*) {
      cursor: text;
    }

    :host(${floatLabel}:is(:focus-within, [has-value])) slot[name='label'] {
      --_label-background-color: var(--oryx-color-neutral-1);

      color: var(--oryx-color-neutral-11);
      font-size: 12px;
      padding: 3px 8px;
      inset-block-start: -10px;
      inset-inline-start: 20px;
      max-width: calc(100% - 56px);
    }

    :host(${floatLabel}[has-prefix]:is(:focus-within, [has-value]))
      slot[name='label'] {
      inset-inline-start: calc(var(--float-label-start-gap, 0px) + 7px);
      max-width: calc(100% - 30px - calc(var(--float-label-start-gap, 0px)));
    }

    :host(${floatLabel}[has-value][disabled]) slot[name='label'] {
      --_label-background-color: var(--oryx-color-neutral-3);
    }
  `;
};

const smScreenRules = floatingLabelStyles(false);

export const floatingLabelBaseStyles = floatingLabelStyles();

export const floatingLabelStylesheets = screenCss({ sm: smScreenRules });

import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    border-radius: var(--oryx-border-radius);
    color: var(--oryx-color-ink);
    background-color: var(--background-color);
  }

  slot {
    display: flex;
  }

  slot:not([name]) {
    display: block;
  }

  :host(:not([type='secondary'])) {
    --background-color: var(--oryx-color-canvas);

    box-shadow: 0 1px 3px var(--oryx-elevation-color);
  }

  :host([type='secondary']) {
    --background-color: var(--oryx-color-neutral-lighter);
  }

  :host(:not([type='secondary'])) slot[name='header'] {
    padding: var(--oryx-card-header-padding, 18px 30px);
  }

  :host(:not([type='secondary'])) slot:not([name]) {
    padding: var(--oryx-card-body-padding, 18px 30px);
  }

  :host(:not([type='secondary'])) slot[name='footer'] {
    padding: var(--oryx-card-footer-padding, 0 30px);
  }

  :host(:not([type='secondary'])) slot[name='footer']::slotted(*) {
    margin-top: 18px;
    margin-bottom: 18px;
  }

  :host([type='secondary']) slot[name='header'] {
    padding: var(--oryx-card-header-padding, 13px 20px);
  }

  :host([type='secondary']) slot:not([name]) {
    padding: var(--oryx-card-body-padding, 13px 20px);
  }

  :host([type='secondary']) slot[name='footer'] {
    padding: var(--oryx-card-footer-padding, 0 20px);
  }

  :host([type='secondary']) slot[name='footer']::slotted(*) {
    margin-top: 13px;
    margin-bottom: 13px;
  }

  slot[name='header'] {
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid var(--oryx-color-neutral);
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
  }

  slot[name='header']::slotted(oryx-icon) {
    color: var(--oryx-color-neutral-darker);
  }

  slot[name='header'] h5,
  slot[name='header']::slotted(h1),
  slot[name='header']::slotted(h2),
  slot[name='header']::slotted(h3),
  slot[name='header']::slotted(h4),
  slot[name='header']::slotted(h5),
  slot[name='header']::slotted(h6) {
    font: inherit;
    margin: 0;
  }
`;

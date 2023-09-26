import { css } from 'lit';
import { LayoutStyles } from '../layout.model';
export const styles: LayoutStyles = {
  styles: css`
    :host {
      display: flex;
      flex-wrap: wrap;
    }

    :host(:not([layout-vertical])) {
      align-items: var(--align, start);
      justify-content: var(--justify, start);
    }

    oryx-content-link::part(anchor) {
      width: 100%;
      text-decoration: none;
    }

    :host(:not([layout-vertical])) oryx-content-link::part(anchor) {
      padding-block: 15px;
    }

    :host(:not([layout-vertical])) oryx-content-link {
      /* border-block-end: solid 4px transparent; */
    }

    :host(:not([layout-vertical])) oryx-content-link::after {
      content: '';
      margin-top: -4px;
      display: block;
      height: 4px;
      transition: background-color 0.3s ease-in-out;
    }

    :host(:not([layout-vertical])) oryx-content-link:hover::after {
      background-color: var(--oryx-color-primary-9);
      transition-delay: 0;
    }

    :host(:not([layout-vertical])) oryx-content-link:hover {
      border-color: var(--oryx-color-primary-9);
      color: var(--oryx-color-primary-9);
    }

    :host([layout-vertical]) oryx-content-link::part(anchor) {
      /* border-inline-end: solid 4px transparent; */
      padding-block: 11px;
    }

    :host([layout-vertical]) oryx-content-link::before {
      content: '';
      /* margin-inline-start: -4px; */
      display: block;
      width: 4px;
      height: 100%;
      transition: background-color 0.3s ease-in-out;
      background-color: var(--oryx-color-primary-9);
    }

    :host([layout-vertical]) oryx-content-link {
      /* border-inline-start: solid 4px transparent; */
    }

    :host([layout-vertical]) oryx-content-link:hover {
      border-color: var(--oryx-color-primary-9);
    }

    :host([layout-vertical]) {
      flex-direction: column;
    }

    /* * {
      outline: solid 3px red;
    } */
  `,
};

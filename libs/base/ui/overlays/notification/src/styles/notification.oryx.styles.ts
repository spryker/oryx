import { css, unsafeCSS } from 'lit';
import { Schemes, Types } from '../notification.model';

export const notificationStyles = css`
  :host {
    border-inline-start: 6px solid var(--_notification-main-color);
    border-radius: var(--oryx-border-radius-small);
  }

  :host([type]) {
    padding-inline-start: 64px;
  }

  :host([type])::before {
    position: absolute;
    inset-block-start: 10px;
    inset-inline-start: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    line-height: 12px;
  }

  :host([type='${unsafeCSS(Types.INFO)}'])::before {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px'%3E %3Cpath d='M12.1498 10.55C12.543 10.5472 12.9249 10.6815 13.2298 10.93C13.5081 11.1509 13.6732 11.4847 13.6798 11.84V17C13.6058 17.7734 12.924 18.3437 12.1498 18.28C11.3755 18.3437 10.6937 17.7734 10.6198 17V11.84C10.6264 11.4847 10.7914 11.1509 11.0698 10.93C11.3746 10.6815 11.7565 10.5472 12.1498 10.55Z' fill='%232480F2' /%3E %3Cpath d='M13.6798 7.59001C13.6798 6.74501 12.9948 6.06001 12.1498 6.06001C11.3048 6.06001 10.6198 6.74501 10.6198 7.59001C10.6198 7.99579 10.781 8.38495 11.0679 8.67188C11.3548 8.95881 11.744 9.12001 12.1498 9.12001C12.9948 9.12001 13.6798 8.435 13.6798 7.59001Z' fill='%232480F2' /%3E %3Cpath d='M1.00977 12.1567C1.00793 18.312 5.99439 23.3045 12.1498 23.31C18.311 23.3045 23.3042 18.3112 23.3098 12.15C23.3042 5.99464 18.3118 1.00817 12.1564 1.01001C6.00106 1.01185 1.01161 6.00131 1.00977 12.1567ZM3.97248 8.77557C5.3417 5.46733 8.56936 3.31001 12.1498 3.31001C17.0313 3.3155 20.9887 7.26848 20.9998 12.15C21.0038 15.7304 18.8501 18.9605 15.5434 20.3335C12.2368 21.7064 8.42857 20.9517 5.89541 18.4214C3.36226 15.8911 2.60325 12.0838 3.97248 8.77557Z' fill='%232480F2' /%3E %3C/svg%3E ");
    background: var(--oryx-color-info-100);
  }

  :host([type='${unsafeCSS(Types.SUCCESS)}'])::before {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px'%3E %3Cpath d='M11.1198 16.3664C11.4502 16.3664 11.767 16.2345 11.9998 16L17.4898 10.47C17.8042 10.1556 17.9269 9.69737 17.8119 9.2679C17.6968 8.83843 17.3613 8.50298 16.9319 8.3879C16.5024 8.27283 16.0442 8.39561 15.7298 8.71001L11.3398 13.1C11.2816 13.1586 11.2024 13.1916 11.1198 13.1916C11.0372 13.1916 10.958 13.1586 10.8998 13.1L9.27976 11.48C8.96537 11.1656 8.50713 11.0428 8.07766 11.1579C7.64819 11.273 7.31274 11.6084 7.19766 12.0379C7.08258 12.4674 7.20537 12.9256 7.51976 13.24L10.2398 16C10.4726 16.2345 10.7893 16.3664 11.1198 16.3664Z' fill='%2317b497' /%3E %3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12.1498 23.31C5.99439 23.3045 1.00793 18.312 1.00977 12.1567C1.01161 6.00131 6.00106 1.01185 12.1564 1.01001C18.3118 1.00817 23.3042 5.99464 23.3098 12.15C23.3042 18.3112 18.311 23.3045 12.1498 23.31ZM12.1498 3.31001C8.56936 3.31001 5.3417 5.46733 3.97248 8.77557C2.60325 12.0838 3.36226 15.8911 5.89541 18.4214C8.42857 20.9517 12.2368 21.7064 15.5434 20.3335C18.8501 18.9605 21.0038 15.7304 20.9998 12.15C20.9887 7.26848 17.0313 3.3155 12.1498 3.31001Z' fill='%2317b497' /%3E %3C/svg%3E");
    background: var(--oryx-color-success-100);
  }

  :host([type='${unsafeCSS(Types.WARNING)}'])::before {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px'%3E %3Cpath d='M12 5.26509C12.7611 5.18489 13.4491 5.72154 13.5566 6.47925V11.3151C13.4491 12.0728 12.7611 12.6095 12 12.5292C11.2389 12.6095 10.5509 12.0728 10.4434 11.3151V6.46887C10.5559 5.71534 11.2424 5.18445 12 5.26509Z' fill='%23ff6800' /%3E %3Cpath d='M13.5566 16.1613C13.5566 15.3016 12.8597 14.6047 12 14.6047C11.1403 14.6047 10.4434 15.3016 10.4434 16.1613C10.4434 17.021 11.1403 17.7179 12 17.7179C12.8597 17.7179 13.5566 17.021 13.5566 16.1613Z' fill='%23ff6800' /%3E %3Cpath d='M12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C22.9943 18.0728 18.0728 22.9943 12 23ZM12 3.28302C7.1871 3.28302 3.28493 7.18364 3.28303 11.9965C3.28112 16.8094 7.18019 20.7132 11.9931 20.717C16.806 20.7208 20.7113 16.8233 20.717 12.0104C20.717 7.19444 16.8159 3.28875 12 3.28302Z' fill='%23ff6800' /%3E %3C/svg%3E ");
    background: var(--oryx-color-warning-100);
  }

  :host([type='${unsafeCSS(Types.ERROR)}'])::before {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px'%3E %3Cpath d='M12.2317 23.4633C6.02859 23.4633 1 18.4347 1 12.2317C1 6.02859 6.02859 1 12.2317 1C18.4347 1 23.4633 6.02859 23.4633 12.2317C23.458 18.4326 18.4326 23.458 12.2317 23.4633ZM12.2317 3.33833C7.30943 3.33833 3.31917 7.3286 3.31917 12.2508C3.31917 14.2442 3.97355 16.0846 5.0792 17.5692L17.4359 5.00988C15.9718 3.95382 14.1745 3.33084 12.2317 3.32875V3.33833ZM19.3696 6.90985L7.01327 19.4767C8.48011 20.5378 10.2828 21.1633 12.2317 21.1633C17.1539 21.1633 21.1442 17.1731 21.1442 12.2508C21.1442 10.2479 20.4841 8.39897 19.3696 6.90985Z' fill='%23f2392e' /%3E %3C/svg%3E");
    background: var(--oryx-color-error-100);
  }

  :host([type='${unsafeCSS(Types.INFO)}']) {
    --_notification-main-color: var(--oryx-color-info-300);
  }

  :host([type='${unsafeCSS(Types.SUCCESS)}']) {
    --_notification-main-color: var(--oryx-color-success-300);
  }

  :host([type='${unsafeCSS(Types.WARNING)}']) {
    --_notification-main-color: var(--oryx-color-warning-300);
  }

  :host([type='${unsafeCSS(Types.ERROR)}']) {
    --_notification-main-color: var(--oryx-color-error-300);
  }

  :host([floating]) {
    box-shadow: var(--oryx-elevation-3) var(--oryx-elevation-color);
  }

  :host([scheme='${unsafeCSS(Schemes.LIGHT)}']) {
    background: var(--oryx-color-canvas-100);
  }

  :host([scheme='${unsafeCSS(Schemes.DARK)}']) {
    background: var(--oryx-color-canvas-200);
  }

  slot[name='icon'] {
    display: block;
    padding: 7px;
    border-radius: 50%;
    color: var(--_notification-main-color);
  }

  slot[name='icon'] > i {
    all: unset;
    width: 24px;
    height: 24px;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjMiIGhlaWdodD0iMjMiIHZpZXdCb3g9IjAgMCAyMyAyMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjExOTggMTUuMzY2NEMxMC40NTAyIDE1LjM2NjQgMTAuNzY3IDE1LjIzNDUgMTAuOTk5OCAxNUwxNi40ODk4IDkuNDcwMDFDMTYuODA0MiA5LjE1NTYxIDE2LjkyNjkgOC42OTczNyAxNi44MTE5IDguMjY3OUMxNi42OTY4IDcuODM4NDMgMTYuMzYxMyA3LjUwMjk4IDE1LjkzMTkgNy4zODc5QzE1LjUwMjQgNy4yNzI4MyAxNS4wNDQyIDcuMzk1NjEgMTQuNzI5OCA3LjcxMDAxTDEwLjMzOTggMTIuMUMxMC4yODE2IDEyLjE1ODYgMTAuMjAyNCAxMi4xOTE2IDEwLjExOTggMTIuMTkxNkMxMC4wMzcyIDEyLjE5MTYgOS45NTc5NiAxMi4xNTg2IDkuODk5NzYgMTIuMUw4LjI3OTc2IDEwLjQ4QzcuOTY1MzcgMTAuMTY1NiA3LjUwNzEzIDEwLjA0MjggNy4wNzc2NiAxMC4xNTc5QzYuNjQ4MTkgMTAuMjczIDYuMzEyNzQgMTAuNjA4NCA2LjE5NzY2IDExLjAzNzlDNi4wODI1OCAxMS40Njc0IDYuMjA1MzcgMTEuOTI1NiA2LjUxOTc2IDEyLjI0TDkuMjM5NzYgMTVDOS40NzI1NiAxNS4yMzQ1IDkuNzg5MzMgMTUuMzY2NCAxMC4xMTk4IDE1LjM2NjRaIiBmaWxsPSIjMTdCNDk3Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTEuMTQ5OCAyMi4zMUM0Ljk5NDM5IDIyLjMwNDUgMC4wMDc5MjY2NyAxNy4zMTIgMC4wMDk3NjYxMyAxMS4xNTY3QzAuMDExNjA4NyA1LjAwMTMxIDUuMDAxMDYgMC4wMTE4NTI4IDExLjE1NjQgMC4wMTAwMTAzQzE3LjMxMTggMC4wMDgxNzA4MSAyMi4zMDQyIDQuOTk0NjQgMjIuMzA5OCAxMS4xNUMyMi4zMDQyIDE3LjMxMTIgMTcuMzExIDIyLjMwNDUgMTEuMTQ5OCAyMi4zMVpNMTEuMTQ5OCAyLjMxMDAxQzcuNTY5MzYgMi4zMTAwMSA0LjM0MTcgNC40NjczMyAyLjk3MjQ4IDcuNzc1NTdDMS42MDMyNSAxMS4wODM4IDIuMzYyMjYgMTQuODkxMSA0Ljg5NTQxIDE3LjQyMTRDNy40Mjg1NyAxOS45NTE3IDExLjIzNjggMjAuNzA2NCAxNC41NDM0IDE5LjMzMzVDMTcuODUwMSAxNy45NjA1IDIwLjAwMzggMTQuNzMwNCAxOS45OTk4IDExLjE1QzE5Ljk4ODcgNi4yNjg0OCAxNi4wMzEzIDIuMzE1NSAxMS4xNDk4IDIuMzEwMDFaIiBmaWxsPSIjMTdCNDk3Ii8+Cjwvc3ZnPgo=')
      no-repeat;
  }

  slot[name='subtext'] {
    color: var(--oryx-color-neutral-300);
  }
`;

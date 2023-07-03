import { css } from 'lit';

export const checkboxStyles = css`
  :host([disabled]) {
    pointer-events: none;
  }

  :host([required]) label::after {
    content: '*';
    color: var(--oryx-required-asterisk-color, currentColor);
    inset-inline-start: -8px;
    position: relative;
  }

  ::slotted(input) {
    height: 18px;
    width: 18px;
    appearance: none;
    border-radius: 4px;
    display: block;
    outline: none;
    margin: 0;
  }

  ::slotted(input)::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
  }

  ::slotted(input:not(:disabled))::after {
    cursor: pointer;
  }

  ::slotted(input)::before {
    content: '';
    height: 14px;
    width: 14px;
    border-radius: 4px;
    position: relative;
    display: block;
    border: 2px solid var(--oryx-color-neutral-8);
    background-repeat: no-repeat;
    background-position: center;
  }

  :host(:not([intermediate])) ::slotted(input:checked)::before {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMiAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS42MjM4IDIuNTgwMzhMNS4wOTMwNiA5LjI4MTAzQzQuODQxNjMgOS41Mzc2OCA0LjUxNDUxIDkuNjY2NjcgNC4xODYxMSA5LjY2NjY3QzMuODU3NzIgOS42NjY2NyAzLjUyOTMyIDkuNTM3NjggMy4yNzkxNyA5LjI4MTAzTDAuMzc2MTgzIDYuMzAyNTJDLTAuMTI1Mzk0IDUuNzg5MjEgLTAuMTI1Mzk0IDQuOTU2MDggMC4zNzYxODMgNC40NDE0NUMwLjg3Nzc1OSAzLjkyNjgzIDEuNjg4NDkgMy45MjY4MyAyLjE5MDA3IDQuNDQxNDVMNC4xODYxMSA2LjQ4OTQyTDkuODA5OTMgMC43MTkzMDVDMTAuMzExNSAwLjIwNDY4IDExLjEyMjIgMC4yMDQ2OCAxMS42MjM4IDAuNzE5MzA1QzEyLjEyNTQgMS4yMzM5MyAxMi4xMjU0IDIuMDY1NzUgMTEuNjIzOCAyLjU4MDM4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==');
    background-color: var(--oryx-color-primary-9);
    border-color: var(--oryx-color-primary-9);
  }

  :host([intermediate]) ::slotted(input)::before {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEuMzMzNSA4QzEuMzMzNSA3LjI2MzYyIDEuOTMwNDUgNi42NjY2NiAyLjY2NjgzIDYuNjY2NjZIMTMuMzMzNUMxNC4wNjk5IDYuNjY2NjYgMTQuNjY2OCA3LjI2MzYyIDE0LjY2NjggOEMxNC42NjY4IDguNzM2MzggMTQuMDY5OSA5LjMzMzMzIDEzLjMzMzUgOS4zMzMzM0gyLjY2NjgzQzEuOTMwNDUgOS4zMzMzMyAxLjMzMzUgOC43MzYzOCAxLjMzMzUgOFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=');
    background-color: var(--oryx-color-primary-9);
    border-color: var(--oryx-color-primary-9);
  }

  :host(:not([intermediate])) ::slotted(input:disabled)::before {
    border-color: var(--oryx-color-neutral-6);
    background-color: var(--oryx-color-neutral-3);
  }

  :host([intermediate]) ::slotted(input:disabled)::before {
    background-color: var(--oryx-color-neutral-3);
    border-color: var(--oryx-color-neutral-3);
  }

  :host(:not([intermediate])) ::slotted(input:checked:disabled)::before {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMiAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTExLjYyMzggMi41ODAzOEw1LjA5MzA2IDkuMjgxMDNDNC44NDE2MyA5LjUzNzY4IDQuNTE0NTEgOS42NjY2NyA0LjE4NjExIDkuNjY2NjdDMy44NTc3MiA5LjY2NjY3IDMuNTI5MzIgOS41Mzc2OCAzLjI3OTE3IDkuMjgxMDNMMC4zNzYxODMgNi4zMDI1MkMtMC4xMjUzOTQgNS43ODkyMSAtMC4xMjUzOTQgNC45NTYwNyAwLjM3NjE4MyA0LjQ0MTQ1QzAuODc3NzU5IDMuOTI2ODIgMS42ODg0OSAzLjkyNjgyIDIuMTkwMDcgNC40NDE0NUw0LjE4NjExIDYuNDg5NDJMOS44MDk5MyAwLjcxOTMwM0MxMC4zMTE1IDAuMjA0Njc4IDExLjEyMjIgMC4yMDQ2NzggMTEuNjIzOCAwLjcxOTMwM0MxMi4xMjU0IDEuMjMzOTMgMTIuMTI1NCAyLjA2NTc1IDExLjYyMzggMi41ODAzOFoiIGZpbGw9IiM5RUExQTciLz4KICA8L3N2Zz4KICA=');
    background-color: var(--oryx-color-neutral-3);
    border-color: var(--oryx-color-neutral-3);
  }

  :host([intermediate]) ::slotted(input:checked:disabled)::before {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMS4zMzM1IDhDMS4zMzM1IDcuMjYzNjIgMS45MzA0NSA2LjY2NjY3IDIuNjY2ODMgNi42NjY2N0gxMy4zMzM1QzE0LjA2OTkgNi42NjY2NyAxNC42NjY4IDcuMjYzNjIgMTQuNjY2OCA4QzE0LjY2NjggOC43MzYzOCAxNC4wNjk5IDkuMzMzMzMgMTMuMzMzNSA5LjMzMzMzSDIuNjY2ODNDMS45MzA0NSA5LjMzMzMzIDEuMzMzNSA4LjczNjM4IDEuMzMzNSA4WiIgZmlsbD0iIzlFQTFBNyIvPgogIDwvc3ZnPgogIA==');
  }

  :host([hasError]) ::slotted(input:not(:disabled))::before {
    border-color: var(--oryx-color-error-9);
  }

  :host(:not([intermediate]):not([hasError]):hover)
    ::slotted(input:checked:not(:disabled))::before {
    border-color: var(--oryx-color-primary-10);
    background-color: var(--oryx-color-primary-10);
  }

  :host([intermediate]:not([hasError]):hover)
    ::slotted(input:not(:disabled))::before {
    border-color: var(--oryx-color-primary-10);
    background-color: var(--oryx-color-primary-10);
  }

  :host(:not([intermediate]):not([hasError]):hover)
    ::slotted(input:not(:disabled))::before {
    border-color: var(--oryx-color-neutral-9);
  }

  :host(:not([hasError]))
    ::slotted(input:not(:disabled):focus-visible)::before {
    height: 18px;
    width: 18px;
    border: none;
    box-shadow: 0 0 3px var(--oryx-color-focus),
      inset 0 0 0 2px var(--oryx-color-primary-9);
  }

  :host(:not([hasError]))
    ::slotted(input:not(:disabled):checked:focus-visible)::before {
    height: 18px;
    width: 18px;
    border: none;
    box-shadow: 0 0 3px var(--oryx-color-focus),
      inset 0 0 0 1px var(--oryx-color-neutral-1);
  }
`;

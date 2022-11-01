export default (root: string): string => `
  ${root} {
    font-family: var(--oryx-font);
    font-size: var(--oryx-font-size-base);
    font-weight: var(--oryx-font-weight-medium);
    letter-spacing: 0.005em;
    color: var(--oryx-color-ink);
    background-color: var(--oryx-color-canvas);
  }

  ::placeholder {
    color: var(--oryx-color-placeholder);
  }
`;

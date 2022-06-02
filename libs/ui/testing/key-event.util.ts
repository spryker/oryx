export function dispatchKeydown(
  element: HTMLElement,
  key: string,
  metaKey = false
): void {
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      composed: true,
      metaKey,
    })
  );
}

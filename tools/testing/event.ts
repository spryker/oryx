interface EventProps extends EventInit {
  type: string;
  [key: string]: unknown;
}

export function createEvent(prop: string | EventProps, value?: unknown) {
  const props: EventProps = typeof prop === 'string' ? { type: prop } : prop;
  const { type, ...options } = props;
  const base = ['click'];
  const keyboard = ['keydown'];

  if (base.includes(type)) {
    return new Event(type, options);
  }
  if (keyboard.includes(type)) {
    return new KeyboardEvent(type, options);
  }

  return new CustomEvent(type, {
    ...options,
    detail: value,
  });
}

// TODO: change with `createEvent`
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

export const createElement = <K extends keyof HTMLElementTagNameMap>(
  name: K,
  attributes: Record<string, string>
): HTMLElementTagNameMap[K] => {
  const el = document.createElement(name);

  Object.entries(attributes || {}).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });

  return el;
};

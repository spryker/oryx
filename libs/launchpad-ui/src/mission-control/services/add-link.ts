import { createElement } from './create-element';

export const addLink = (
  href: string,
  attributes?: Record<string, string>
): void => {
  const css = createElement('link', {
    rel: 'stylesheet',
    href,
    ...attributes,
  });

  document.getElementsByTagName('head')[0].appendChild(css);
};

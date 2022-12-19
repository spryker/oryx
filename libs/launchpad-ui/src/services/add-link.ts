import { createElement } from './create-element';

export const addLink = (
  href: string,
  attributes?: Record<string, string>
): Promise<void> =>
  new Promise((resolve) => {
    const css = createElement('link', {
      rel: 'stylesheet',
      href,
      ...attributes,
    });

    document.getElementsByTagName('head')[0].appendChild(css);
    css.addEventListener('load', () => {
      resolve();
    });
  });

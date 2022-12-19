import { createElement } from './create-element';

export const addScript = (
  src: string,
  attributes?: Record<string, string>
): Promise<void> =>
  new Promise((resolve) => {
    const js = createElement('script', {
      src,
      ...attributes,
    });

    document.getElementsByTagName('body')[0].appendChild(js);

    js.addEventListener('load', () => {
      resolve();
    });
  });

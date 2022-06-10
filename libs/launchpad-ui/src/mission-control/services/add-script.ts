import { createElement } from './create-element';

export const addScript = (
  src: string,
  attributes?: Record<string, string>
): void => {
  const js = createElement('script', {
    src,
    ...attributes,
  });

  document.getElementsByTagName('body')[0].appendChild(js);
};

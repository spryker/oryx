// organize-imports-ignore
import '@lit-labs/ssr/lib/render-with-global-dom-shim.js';
import './app';
import { render as litRender } from '@lit-labs/ssr/lib/render-lit-html.js';
import { html } from 'lit';
import { Readable } from 'stream';

export const renderComponent = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  element
): Promise<IterableIterator<string>> => {
  return await litRender(html`<storefront-component></storefront-component>`);
};

export const render = async (element): Promise<string> => {
  const ssrResult = await renderComponent(element);
  let stream = '';
  const readable = Readable.from(ssrResult);

  readable.on('data', function (data) {
    stream += data;
  });

  await new Promise<void>((resolve) =>
    readable.on('end', function () {
      resolve();
    })
  );
  return stream;
};

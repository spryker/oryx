// organize-imports-ignore
import './app.server';
import { getInjector } from '@spryker-oryx/injector';
import { CoreServices } from '@spryker-oryx/core';
import { render as litRender } from '@lit-labs/ssr/lib/render-lit-html.js';
import { html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fetch from 'node-fetch';
// We need vite to bundle this and for it to realize it's really an esm module in dev mode
import AbortController from 'abort-controller/dist/abort-controller.mjs';

globalThis.AbortController = AbortController;

export const renderComponent = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  element
): Promise<IterableIterator<string>> => {
  return await litRender(html`<storefront-component></storefront-component>`);
};

export const render = async (element): Promise<string> => {
  const awaiter = getInjector().inject(CoreServices.SSRAwaiter);
  const ssrResult = await renderComponent(element);
  let stream = '';
  let data = ssrResult.next();
  while (!data.done) {
    if (awaiter.hasAwaiter()) {
      try {
        await awaiter.await();
      } catch (e) {
        console.log(e);
      }
    }
    stream += data.value;
    data = ssrResult.next();
  }
  return stream;
};

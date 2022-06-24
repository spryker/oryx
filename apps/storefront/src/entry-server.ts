// organize-imports-ignore
import './app.server';
import { getInjector } from '@spryker-oryx/injector';
import { SSRAwaiterService, ContextService } from '@spryker-oryx/core';
import { render as litRender } from '@lit-labs/ssr/lib/render-lit-html.js';
import { html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fetch from 'node-fetch';
import 'abort-controller/polyfill';
import { ServerContextService } from '@spryker-oryx/core/server';

export const renderComponent = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  element
): Promise<IterableIterator<string>> => {
  return await litRender(html`<storefront-component></storefront-component>`);
};

export const render = async (element): Promise<string> => {
  window.location = element.route;
  const awaiter = getInjector().inject(SSRAwaiterService);
  const context = getInjector().inject(ContextService) as ServerContextService;
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
    context.fillStream(stream);
  }
  context.rendered();
  return stream;
};

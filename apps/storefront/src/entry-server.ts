// organize-imports-ignore
import { appBuilder } from './app';
import { getInjector } from '@spryker-oryx/injector';
import { RouterService } from '@spryker-oryx/experience';
import { App, SSRAwaiterService, ContextService } from '@spryker-oryx/core';
import { render as litRender } from '@lit-labs/ssr/lib/render-lit-html.js';
import { html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fetch from 'node-fetch';
import 'abort-controller/polyfill';
import { ServerContextService } from '@spryker-oryx/core/server';

let orchestrator: App | void;

export const renderComponent = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  element
): Promise<IterableIterator<string>> => {
  return await litRender(html`<storefront-component></storefront-component>`);
};

export const render = async (element): Promise<string> => {
  if (!orchestrator) {
    orchestrator = await appBuilder;
  }
  window.location = element.route;
  const routerService = getInjector().inject(RouterService);
  const awaiter = getInjector().inject(SSRAwaiterService);
  const context = getInjector().inject(ContextService) as ServerContextService;
  const ssrResult = await renderComponent(element);

  routerService.go(window.location.pathname);

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

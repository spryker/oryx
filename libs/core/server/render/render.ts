// organize-imports-ignore
import { App, ContextService, SSRAwaiterService } from '@spryker-oryx/core';
import { getInjector } from '@spryker-oryx/injector';
import { ServerContextService } from '../services';
import { TemplateResult } from 'lit';
import fetch from 'node-fetch';
import 'abort-controller/polyfill';

export interface RenderAppConfig {
  route: Location;
  element: TemplateResult;
}

let orchestrator: App | void;
export const renderApp = async (
  config: RenderAppConfig,
  app: Promise<App>,
  litRender: (value: unknown) => IterableIterator<string>
): Promise<string> => {
  if (!orchestrator) {
    orchestrator = await app;
  }
  window.location = config.route;
  // TODO: change to `RouterService` token when fix circular dependency
  const routerService = getInjector().inject('FES.RouterService');
  const awaiter = getInjector().inject(SSRAwaiterService);
  const context = getInjector().inject(ContextService) as ServerContextService;
  const ssrResult = litRender(config.element);

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

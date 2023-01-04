// organize-imports-ignore
import { App, ContextService, SSRAwaiterService } from '@spryker-oryx/core';
import { getInjector } from '@spryker-oryx/di';
import { TemplateResult } from 'lit';
import { ServerContextService } from '@spryker-oryx/core/server';
import { RouterService } from '@spryker-oryx/experience';
import { render as litRender } from '@lit-labs/ssr';
import 'abort-controller/polyfill.js';

export interface RenderAppConfig {
  route: Location;
  element: TemplateResult;
}

let orchestrator: App | void;

export const renderApp = async (
  config: RenderAppConfig,
  app: Promise<App>
): Promise<string> => {
  if (!orchestrator) {
    orchestrator = await app;
  }

  window.location = config.route;

  const routerService = getInjector().inject(RouterService);
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

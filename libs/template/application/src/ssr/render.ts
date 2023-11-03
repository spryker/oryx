import {
  App,
  ContextService,
  PageMetaService,
  InjectionPlugin,
  SSRAwaiterService,
} from '@spryker-oryx/core';
import { TemplateResult } from 'lit';
import {
  ServerContextService,
  ServerPageMetaService,
} from '@spryker-oryx/core/server';
import { RouterService } from '@spryker-oryx/router';
import { render as litRender } from '@lit-labs/ssr';
import { rootInjectable } from '@spryker-oryx/utilities';
// organize-imports-ignore
import 'abort-controller/polyfill.js';

export interface RenderAppConfig {
  route: Location;
  element: TemplateResult;
  template: string;
}

let orchestrator: App | void;

export const renderApp = async (
  config: RenderAppConfig,
  app: Promise<App>
): Promise<string> => {
  if (!orchestrator) orchestrator = await app;

  const { route, element, template } = config;

  globalThis.location = route;

  const injector = orchestrator.requirePlugin(InjectionPlugin).getInjector();
  const routerService = injector.inject(RouterService);
  const awaiter = injector.inject(SSRAwaiterService);
  const meta = injector.inject(PageMetaService) as ServerPageMetaService;
  const context = injector.inject(ContextService) as ServerContextService;
  const ssrResult = litRender(element);

  routerService.go(globalThis.location.pathname);

  let stream = '';

  for (const data of ssrResult) {
    if (awaiter.hasAwaiter()) {
      try {
        await awaiter.await();
      } catch (e) {
        console.log(e);
      }
    }

    stream += data;
    context.fillStream(stream);
  }

  context.rendered();

  const root = rootInjectable.get();
  const html = meta
    .getTemplateHtml(template)
    .replace(`<${root}></${root}>`, stream);

  return html;
};

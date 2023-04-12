import {
  App,
  ContextService,
  PageHeadService,
  InjectionPlugin,
  SSRAwaiterService,
  ThemePlugin,
} from '@spryker-oryx/core';
import { TemplateResult } from 'lit';
import {
  ServerContextService,
  ServerPageHeadService,
} from '@spryker-oryx/core/server';
import { RouterService } from '@spryker-oryx/router';
import { render as litRender } from '@lit-labs/ssr';
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
  if (!orchestrator) {
    orchestrator = await app;
  }

  const { route, element, template } = config;

  globalThis.location = route;
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const injector = orchestrator.findPlugin(InjectionPlugin)!.getInjector();
  const headDefinition = orchestrator
    .findPlugin(ThemePlugin)!
    .getHeadDefinition();
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
  const routerService = injector.inject(RouterService);
  const awaiter = injector.inject(SSRAwaiterService);
  const headDom = injector.inject(PageHeadService) as ServerPageHeadService;
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

  const component = element.strings[0];
  const componentName = component.substring(
    component.indexOf('<') + 1,
    component.indexOf('>')
  );
  const htmlAttrs = headDefinition?.find((def) => def.name === 'html')?.attrs;
  const html = template
    .replace('<html', `<html ${headDom.getElementAttributes(htmlAttrs ?? {})}`)
    .replace('</head>', `${headDom.getElements(headDefinition ?? [])}\n</head>`)
    .replace(`<${componentName}></${componentName}>`, stream);

  return html;
};

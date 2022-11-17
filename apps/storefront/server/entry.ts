import { render as litRender } from '@lit-labs/ssr/lib/render-lit-html.js';
import { renderApp, RenderAppConfig } from '@spryker-oryx/core/server';
import { html } from 'lit';
import { appBuilder } from '../src/app';

export const render = (
  config: Omit<RenderAppConfig, 'element'>
): Promise<string> =>
  renderApp(
    {
      ...config,
      element: html`<storefront-component></storefront-component>`,
    },
    appBuilder,
    litRender
  );

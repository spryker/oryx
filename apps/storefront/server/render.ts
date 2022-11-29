import { renderApp, RenderAppConfig } from '@spryker-oryx/application';
import { html } from 'lit';
import { app } from '../src/app';

export const render = (
  config: Omit<RenderAppConfig, 'element'>
): Promise<string> =>
  renderApp(
    {
      ...config,
      element: html`<root-app></root-app>`,
    },
    app
  );

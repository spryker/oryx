import {
  App,
  AppPlugin,
  AppPluginAfterApply,
  AppPluginBeforeApply,
  ComponentsPlugin,
  ErrorService,
} from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { hydrateShadowRoots } from '@webcomponents/template-shadowroot/template-shadowroot.js';
import { LitElement } from 'lit';
import 'lit/experimental-hydrate-support.js';
import { initHydrateHooks } from './hydrate-hooks';

declare global {
  function litElementHydrateSupport(param: {
    LitElement: typeof LitElement;
  }): void;
}

export const RootPluginName = 'application$root';

export class RootPlugin
  implements AppPlugin, AppPluginBeforeApply, AppPluginAfterApply
{
  protected rootSelector = '';

  getName(): string {
    return RootPluginName;
  }

  beforeApply(): void | Promise<void> {
    try {
      hydrateShadowRoots(document.body);
    } catch (e) {
      console.log(e);
    }

    // This doesn't get called at the right time by lit-html, so we do it here
    globalThis.litElementHydrateSupport?.({ LitElement });
  }

  apply(app: App): void | Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.rootSelector = app.findPlugin(ComponentsPlugin)!.rootSelector;

    // TODO - remove when we have app initializers
    resolve(ErrorService).initialize();

    if (!document.querySelector(this.rootSelector)?.shadowRoot) {
      resolve(RouterService).go(window.location.pathname);
    }
  }

  afterApply(): void | Promise<void> {
    initHydrateHooks(this.rootSelector);
  }
}

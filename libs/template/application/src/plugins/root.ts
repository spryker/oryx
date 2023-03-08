import {
  AppPlugin,
  AppPluginAfterApply,
  AppPluginBeforeApply,
  ErrorService,
} from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { rootInjectable } from '@spryker-oryx/utilities';
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

  apply(): void | Promise<void> {
    // TODO - remove when we have app initializers
    resolve(ErrorService).initialize();

    if (!document.querySelector(rootInjectable.get())?.shadowRoot) {
      resolve(RouterService).go(window.location.pathname);
    }
  }

  afterApply(): void | Promise<void> {
    initHydrateHooks(rootInjectable.get());
  }
}

import {
  AppPlugin,
  AppPluginAfterApply,
  AppPluginBeforeApply,
} from '@spryker-oryx/core';
import { RouterService } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { hydrateShadowRoots } from '@webcomponents/template-shadowroot/template-shadowroot.js';
import { LitElement } from 'lit-element';
import 'lit/experimental-hydrate-support.js';
import { storefrontComponent } from '../../storefront/src/component';
import { initHydrateHooks, initInlineScripts } from '../utilities';

declare global {
  function litElementHydrateSupport(param: { LitElement: unknown }): void;
}

export class StorefrontPlugin
  implements AppPlugin, AppPluginBeforeApply, AppPluginAfterApply
{
  getName(): string {
    return 'storefront';
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
    if (!document.body.querySelector(storefrontComponent().name)?.shadowRoot) {
      resolve(RouterService).go(window.location.pathname);
    }
  }

  afterApply(): void | Promise<void> {
    initHydrateHooks();
    initInlineScripts();
  }
}

import { inject, INJECTOR, OnDestroy } from '@spryker-oryx/di';
import {
  ComponentsPlugin,
  deferHydrationAttribute,
  hasEventsAction,
  hydratableAttribute,
  HydratableLitElement,
  HYDRATE_ON_DEMAND,
  rootInjectable,
  treewalk,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { skip, Subscription, take } from 'rxjs';
import { AppRef } from '../../orchestration/app';
import { ContextService } from '../context';
import { HydrationService, HydrationTrigger } from './hydration.service';

export class DefaultHydrationService implements HydrationService, OnDestroy {
  protected subscription = new Subscription();
  protected contextChange: Record<string, HTMLElement[]> = {};

  constructor(
    protected componentsPlugin = inject(AppRef).requirePlugin(ComponentsPlugin),
    protected root = rootInjectable.get(),
    protected injector = inject(INJECTOR),
    protected context = inject(ContextService)
  ) {
    this.initialize();
  }

  protected initialize(): void {
    const initializers = this.injector.inject(HydrationTrigger, null);

    if (!initializers) {
      return;
    }

    for (const initializer of initializers) {
      this.subscription.add(
        initializer.subscribe((value) => {
          if (value instanceof HTMLElement) {
            this.hydrateOnDemand(value);

            return;
          }

          this.initHydrateHooks(true);
        })
      );
    }
  }

  initHydrateHooks(immediate?: boolean): void {
    const elementsToHydrate = treewalk(`[${hydratableAttribute}]`);

    elementsToHydrate.forEach((el) => {
      if (immediate) {
        this.hydrateOnDemand(el);
        return;
      }

      const modes = el.getAttribute(hydratableAttribute)?.split?.(',') ?? [];

      if (hasEventsAction(el)) modes.push('window:load');

      for (let i = 0; i < modes.length; i++) {
        if (modes[i][0] === '@') {
          this.setupContextHydration(el, modes[i].slice(1));
        } else {
          this.setupEventHydration(el, modes[i]);
        }
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.hydrateOnDemand(document.querySelector<LitElement>(this.root)!);
  }

  protected setupEventHydration(element: HTMLElement, event: string): void {
    const parts = event.split(':');
    const mode = parts[parts.length - 1];
    let target: HTMLElement | typeof window = element;
    if (parts.length > 1) {
      target = parts[0] === 'window' ? window : element;
    }

    target.addEventListener(mode, async () => {
      const childs = treewalk(`[${deferHydrationAttribute}]`, element, false);

      if (childs.length) {
        const promises = childs.map((childEl) => this.hydrateOnDemand(childEl));
        await Promise.all(promises);
      }

      this.hydrateOnDemand(element);
    });
  }

  protected setupContextHydration(element: HTMLElement, context: string): void {
    if (!this.contextChange[context]) {
      this.contextChange[context] = [element];

      this.subscription.add(
        this.context
          .get(element, context)
          .pipe(skip(1), take(1))
          .subscribe(() => {
            this.contextChange[context].forEach((el) =>
              this.hydrateOnDemand(el)
            );
            delete this.contextChange[context];
          })
      );
    } else {
      this.contextChange[context].push(element);
    }
  }

  async hydrateOnDemand(element: HTMLElement): Promise<void> {
    if (!element?.hasAttribute(hydratableAttribute)) {
      return;
    }

    if (!customElements.get(element.localName)) {
      await this.componentsPlugin.loadComponent(element.localName);
      await customElements.whenDefined(element.localName);
    }

    await (element as HydratableLitElement)[HYDRATE_ON_DEMAND]?.();
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }
}

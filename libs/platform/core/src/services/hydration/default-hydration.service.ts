import { inject, INJECTOR } from '@spryker-oryx/di';
import {
  deferHydrationAttribute,
  hydratableAttribute,
  HydratableLitElement,
  HYDRATE_ON_DEMAND,
  rootInjectable,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { Subscription } from 'rxjs';
import { AppRef } from '../../orchestration/app';
import { ComponentsPlugin } from '../../orchestration/components';
import { HydrationService, HydrationTrigger } from './hydration.service';

export class DefaultHydrationService implements HydrationService {
  protected subscription = new Subscription();

  constructor(
    protected componentsPlugin = inject(AppRef).requirePlugin(ComponentsPlugin),
    protected root = rootInjectable.get(),
    protected injector = inject(INJECTOR)
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
    const elementsToHydrate = this.treewalk(`[${hydratableAttribute}]`);

    elementsToHydrate.forEach((el) => {
      if (immediate) {
        this.hydrateOnDemand(el);
        return;
      }

      //need to hydrate elements with dynamic visibility rule on load
      const hasDynamicVisibility = el.hasAttribute('dynamic-visibility');
      if (hasDynamicVisibility) {
        el.setAttribute(hydratableAttribute, 'window:load')
      }
      const modes = el.getAttribute(hydratableAttribute)?.split?.(',') ?? [];

      for (let i = 0; i < modes.length; i++) {
        const parts = modes[i].split(':');
        const mode = parts[parts.length - 1];
        let target: HTMLElement | typeof window = el;
        if (parts.length > 1) {
          target = parts[0] === 'window' ? window : el;
        }

        target.addEventListener(mode, async () => {
          const childs = this.treewalk(
            `[${deferHydrationAttribute}]`,
            el,
            false
          );

          if (childs.length) {
            const promises = childs.map((childEl) =>
              this.hydrateOnDemand(childEl)
            );
            await Promise.all(promises);
          }

          this.hydrateOnDemand(el);
        });
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.hydrateOnDemand(document.querySelector<LitElement>(this.root)!);
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

  protected treewalk(
    selector: string,
    rootNode = document.body,
    includeRoot = true
  ): HTMLElement[] {
    const nodes: Element[] = [rootNode];
    const elements: HTMLElement[] = [];

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }

      if (node.children.length) {
        nodes.push(...node.children);
      }

      if (node.shadowRoot?.children.length) {
        nodes.push(...node.shadowRoot.children);
      }

      if (!includeRoot && node.matches(rootNode.tagName.toLowerCase())) {
        continue;
      }

      if (node.matches(selector)) {
        elements.push(node as HTMLElement);
      }
    }

    return elements;
  }
}

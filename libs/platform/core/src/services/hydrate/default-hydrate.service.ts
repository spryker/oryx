import { inject, INJECTOR, OnDestroy } from '@spryker-oryx/di';
import {
  hydratableAttribute,
  HYDRATE_ON_DEMAND,
  PatchableLitElement,
  rootInjectable,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { Subscription } from 'rxjs';
import { AppRef, ComponentsPlugin } from '../../orchestration';
import { HydrateInitializer, HydrateService } from './hydrate.service';

export class DefaultHydrateService implements HydrateService, OnDestroy {
  protected subscription = new Subscription();

  constructor(
    protected componentsPlugin = inject(AppRef).findPlugin(ComponentsPlugin),
    protected root = rootInjectable.get(),
    protected injector = inject(INJECTOR)
  ) {
    this.initialize();
  }

  protected initialize(): void {
    const initializers = this.injector.inject(HydrateInitializer, null);

    if (!initializers) {
      return;
    }

    for (const initializer of initializers) {
      this.subscription.add(initializer(this, this.injector).subscribe());
    }
  }

  initHydrateHooks(immediate?: boolean): void {
    this.treewalk(`[${hydratableAttribute}]`).forEach((el) => {
      if (immediate) {
        this.hydrateOnDemand(el, true);
        return;
      }

      const modes = el.getAttribute(hydratableAttribute)?.split?.(',') ?? [];

      for (let i = 0; i < modes.length; i++) {
        const parts = modes[i].split(':');
        const mode = parts[parts.length - 1];
        let target: HTMLElement | typeof window = el;
        if (parts.length > 1) {
          target = parts[0] === 'window' ? window : el;
        }

        target.addEventListener(mode, () => this.hydrateOnDemand(el));
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.hydrateOnDemand(document.querySelector<LitElement>(this.root)!);
  }

  async hydrateOnDemand(
    element: HTMLElement,
    skipMissMatch = false
  ): Promise<void> {
    if (!element?.hasAttribute(hydratableAttribute)) {
      return;
    }

    if (!customElements.get(element.localName)) {
      await this.componentsPlugin?.loadComponent(element.localName);
      customElements.upgrade(element);
    }

    (element as PatchableLitElement)[HYDRATE_ON_DEMAND]?.(skipMissMatch);
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected treewalk(
    selector: string,
    rootNode = document.body as HTMLElement
  ): HTMLElement[] {
    const arr: HTMLElement[] = [];

    const traverser = (node: HTMLElement): void => {
      // 1. decline all nodes that are not elements
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      // 2. add the node to the array, if it matches the selector
      if (node.matches(selector)) {
        arr.push(node);
      }

      // 3. loop through the children
      const children = node.children as unknown as HTMLElement[];
      if (children.length) {
        for (const child of children) {
          traverser(child);
        }
      }

      // 4. check for shadow DOM, and loop through it's children
      const shadowRoot = node.shadowRoot;
      if (shadowRoot) {
        const shadowChildren = shadowRoot.children as unknown as HTMLElement[];
        for (const shadowChild of shadowChildren) {
          traverser(shadowChild);
        }
      }
    };

    traverser(rootNode);

    return arr;
  }
}

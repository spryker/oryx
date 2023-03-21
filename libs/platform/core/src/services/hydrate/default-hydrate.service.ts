import { inject } from '@spryker-oryx/di';
import {
  hydratableAttribute,
  HYDRATE_ON_DEMAND,
  PatchableLitElement,
  rootInjectable,
} from '@spryker-oryx/utilities';
import { isServer, LitElement } from 'lit';
import { AppRef, ComponentsPlugin } from '../../orchestration';
import { HydrateService } from './hydrate.service';

export const locationEvent = 'oryx.location';
export const forceEvent = 'oryx.force';

export class DefaultHydrateService implements HydrateService {
  constructor(
    protected componentsPlugin = inject(AppRef).findPlugin(ComponentsPlugin),
    protected root = rootInjectable.get()
  ) {
    this.initLocationHydration();
  }

  protected initLocationHydration(): void {
    if (isServer) {
      return;
    }
    let initialNav = true;

    document.addEventListener(locationEvent, () => {
      if (!initialNav) {
        const component = document
          .querySelector(this.root)
          ?.shadowRoot?.querySelector(`[route]`) as LitElement;

        this.hydrateOnDemand(component, true);
      }
      initialNav = false;
    });
  }

  initHydrateHooks(): void {
    this.treewalk(`[${hydratableAttribute}]`).forEach((el) => {
      const modes = el.getAttribute(hydratableAttribute)?.split?.(',') ?? [];
      modes.push(`window:${forceEvent}`);

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

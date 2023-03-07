import { resolve } from '@spryker-oryx/di';
import { ComponentsRegistryService } from '@spryker-oryx/experience';
import { LitElement } from 'lit';

declare global {
  function hydrateOnDemand(element: LitElement): Promise<void>;

  interface Window {
    scriptFns: {
      [key: string]: (host: LitElement) => void;
    };
  }
}

export function treewalk(
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

export function initHydrateHooks(rootSelector: string, force = false): void {
  const registryService = resolve(ComponentsRegistryService);

  //TODO - remove this when we no longer need manual hydrate on demand
  globalThis.hydrateOnDemand =
    registryService.hydrateOnDemand.bind(registryService);

  treewalk('[hydratable]').forEach((el) => {
    if (force) {
      registryService.hydrateOnDemand(el);

      return;
    }

    const modes = el.getAttribute('hydratable')?.split?.(',') ?? [];
    for (let i = 0; i < modes.length; i++) {
      const parts = modes[i].split(':');
      const mode = parts[parts.length - 1];
      let target: HTMLElement | typeof window = el;
      if (parts.length > 1) {
        target = parts[0] === 'window' ? window : el;
      }
      target.addEventListener(mode, () => registryService.hydrateOnDemand(el));
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const root = document.body.querySelector<LitElement>(rootSelector)!;
  registryService.hydrateOnDemand(root);
}

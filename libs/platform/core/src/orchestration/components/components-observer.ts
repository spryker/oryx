import { isNodeElement } from '@spryker-oryx/core/utilities';
import { isServer } from 'lit';
import { AppPlugin } from '../app';
import { ComponentsLoader } from './components-loader';
import {
  ComponentImplMeta,
  ComponentsOptions,
  ObservableShadowElement,
} from './components.model';
import { isObservableShadowElement } from './utilities';

export class ComponentsObserver
  extends ComponentsLoader
  implements Pick<AppPlugin, 'destroy'>
{
  protected readonly observer = new MutationObserver(
    this.handleMutations.bind(this)
  );
  protected readonly implMetaInDom: ComponentImplMeta = { foundInDom: true };

  constructor(protected options: ComponentsOptions) {
    super(options);
  }

  destroy(): void {
    this.observer.disconnect();
  }

  protected observe(element: Node): void {
    this.observer.observe(element, {
      subtree: true,
      childList: true,
      attributes: false,
      characterData: false,
    });

    // Start first check immediately
    this.checkNode(element);
  }

  protected handleMutations(mutations: MutationRecord[]): void {
    this.checkNodes(mutations.map((m) => Array.from(m.addedNodes)).flat());
  }

  protected checkNodes(nodes: Node[]): void {
    nodes.forEach((node) => this.checkNode(node));
  }

  protected addDefinedAttribute(element: HTMLElement): void {
    if (!isServer && !this.options.preload) {
      element.setAttribute('defined', '');
    }
  }

  protected checkNode(node: Node): void {
    if (isNodeElement(node)) {
      const tag = this.processName(node.nodeName);

      if (node.shadowRoot) {
        this.observe(node.shadowRoot);
        this.addDefinedAttribute(node);
      } else if (isObservableShadowElement(node)) {
        this.observeShadow(node);
        this.addDefinedAttribute(node);
      } else {
        this.tryLoadAndDefineComponent(tag, this.implMetaInDom).then(() => {
          customElements.upgrade(node);
          this.addDefinedAttribute(node);
          this.maybeObserveShadow(node);
        });
      }
    }

    this.checkNodes(Array.from(node.childNodes));
  }

  protected maybeObserveShadow(element: HTMLElement): void {
    if (isObservableShadowElement(element)) {
      this.observeShadow(element);
    }
  }

  protected observeShadow(element: ObservableShadowElement): void {
    element.whenShadowAttached().then((shadowRoot) => this.observe(shadowRoot));
  }
}

import { BuilderPlugin } from '../plugins.model';
import { isNodeElement } from '../utilities';
import { ComponentsLoader } from './components-loader';
import { ComponentImplMeta, ObservableShadowElement } from './components.model';
import { isObservableShadowElement } from './utilities';

export class ComponentsObserver
  extends ComponentsLoader
  implements Pick<BuilderPlugin, 'destroy'>
{
  protected readonly observer = new MutationObserver(
    this.handleMutations.bind(this)
  );
  protected readonly implMetaInDom: ComponentImplMeta = { foundInDom: true };

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

  protected checkNode(node: Node): void {
    if (isNodeElement(node)) {
      const tag = this.processName(node.nodeName);

      if (node.shadowRoot) this.observe(node.shadowRoot);
      else if (isObservableShadowElement(node)) this.observeShadow(node);
      else {
        this.tryLoadAndDefineComponent(tag, this.implMetaInDom).then(() => {
          customElements.upgrade(node);
          this.maybeObserveShadow(node);
        });
      }
    }

    this.checkNodes(Array.from(node.childNodes));
  }

  protected maybeObserveShadow(element: HTMLElement): void {
    if (isObservableShadowElement(element)) this.observeShadow(element);
  }

  protected observeShadow(element: ObservableShadowElement): void {
    element.whenShadowAttached().then((shadowRoot) => this.observe(shadowRoot));
  }
}

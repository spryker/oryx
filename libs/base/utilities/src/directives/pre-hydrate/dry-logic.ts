import { LitElement } from 'lit';

export const dryLogic = (): ((
  tag: string,
  fn?: (host: LitElement) => void | Promise<void>
) => void) => {
  let lastNode: Element | null = document.body;
  const scriptFns: {
    [tag: string]: (host: LitElement) => void | Promise<void>;
  } = {};

  function findNext(
    selector: string,
    node: Element | null | undefined
  ): Element | null | void {
    function getNextElement(node: Element) {
      function nextSibling(node: Element) {
        while (node && !node.nextElementSibling) {
          if (node.parentElement) {
            node = node.parentElement;
          } else {
            node =
              (node.getRootNode() as Node & { host: Element }).host ??
              (node.getRootNode() as Element);
            if (node.firstElementChild) {
              return node.firstElementChild;
            }
          }
        }
        return node?.nextElementSibling;
      }

      return (
        node.shadowRoot?.firstElementChild ??
        node.firstElementChild ??
        nextSibling(node)
      );
    }

    while (node) {
      node = getNextElement(node);
      if (node?.matches(selector)) {
        return node;
      }
    }
  }

  return (tag, fn) => {
    if (fn) {
      scriptFns[tag] = fn;
    }

    lastNode = findNext(tag, lastNode) as Element | null;
    scriptFns[tag](lastNode as LitElement);
  };
};

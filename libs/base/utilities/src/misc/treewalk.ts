export function treewalk(
  selector: string,
  rootNode = document.body,
  includeRoot = true
): HTMLElement[] {
  const nodes: Element[] = [rootNode];
  const elements: HTMLElement[] = [];

  for (const node of nodes) {
    if (!node) continue;

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

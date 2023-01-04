export function isNodeElement(node: Node): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE;
}

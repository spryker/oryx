const EVENTS_DATA = Symbol.for('EVENTS_DATA');
const repeatableAttribute = 'repeatable';

const treewalk = (selector, rootNode = document.body, includeRoot = true) => {
  const nodes = [rootNode];
  const elements = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.nodeType !== Node.ELEMENT_NODE) {
      continue;
    }

    if (node.children.length) {
      nodes.push(...(node.children as any));
    }

    if (node.shadowRoot?.children.length) {
      nodes.push(...(node.shadowRoot.children as any));
    }

    if (!includeRoot && node.matches(rootNode.tagName.toLowerCase())) {
      continue;
    }

    if (node.matches(selector)) {
      elements.push(node);
    }
  }

  return elements;
};

const addEventsAction = () => {
  const elements = treewalk(`[${repeatableAttribute}]`);

  for (const element of elements) {
    element[EVENTS_DATA] = {
      events: [],
      listener: (event) => {
        console.log(event, 'event');
        event.stopPropagation();
        event.preventDefault();

        element[EVENTS_DATA]?.events.push(event);
      },
    };

    const events = element.getAttribute(repeatableAttribute);

    for (const eventType of events.split(':')) {
      element.addEventListener(eventType, element[EVENTS_DATA].listener);
    }
  }
};

const isShadow = !!document.querySelector?.('oryx-app').shadowRoot;

if (isShadow) {
  addEventsAction();
}

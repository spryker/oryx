export const EVENTS_DATA = Symbol.for('EVENTS_DATA');
export const replayableAttribute = 'replayable';

export type ElementWithEventsData = HTMLElement & {
  [EVENTS_DATA]?: EventsData;
};

interface EventsData {
  listener: (event: Event) => void;
  events: Event[];
}

const treewalk = (
  selector: string,
  rootNode = document.body,
  includeRoot = true
) => {
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
};

export const addEventsAction = (): void => {
  const elements = treewalk(
    `[${replayableAttribute}]`
  ) as ElementWithEventsData[];

  for (const element of elements) {
    element[EVENTS_DATA] = {
      events: [],
      listener: (event: Event) => {
        event.stopPropagation();
        event.preventDefault();

        element[EVENTS_DATA]?.events.push(event);
      },
    };

    const events = element.getAttribute(replayableAttribute) as string;

    for (const eventType of events.split(':')) {
      element.addEventListener(eventType, element[EVENTS_DATA].listener);
    }
  }
};

export const removeEventsAction = (elements: ElementWithEventsData[]): void => {
  for (const element of elements) {
    if (!element[EVENTS_DATA]) continue;

    const events = element.getAttribute(replayableAttribute) as string;
    for (const eventType of events.split(':')) {
      element.removeEventListener(eventType, element[EVENTS_DATA].listener);
    }
  }
};

export const replayEvents = async (
  elements: ElementWithEventsData[]
): Promise<void> => {
  for (const element of elements) {
    const events = element[EVENTS_DATA]?.events;

    if (!events?.length) return;

    for (const event of events) {
      element.dispatchEvent(event);
    }

    delete element[EVENTS_DATA];
  }
};

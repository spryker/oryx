const eventsDataIdentifier = 'EVENTS_DATA';
export const EVENTS_DATA = Symbol.for(eventsDataIdentifier);
export const repeatableAttribute = 'repeatable';

export type ElementWithEventsData = HTMLElement & {
  [EVENTS_DATA]?: EventsData;
};

interface EventsData {
  listener: (event: Event) => void;
  events: Event[];
}

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

function eventsAction(
  element: ElementWithEventsData,
  shouldRemove?: true
): void {
  const events = element.getAttribute(repeatableAttribute) as string;

  for (const eventType of events.split(',')) {
    if (shouldRemove) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      element.removeEventListener(
        eventType.trim(),
        element[EVENTS_DATA]!.listener
      );
      continue;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    element.addEventListener(eventType.trim(), element[EVENTS_DATA]!.listener);
  }
}

export function addEventsAction(): void {
  const elements = treewalk(
    `[${repeatableAttribute}]`
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

    eventsAction(element);
  }
}

export function repeatEvents(elements: ElementWithEventsData[]): void {
  for (const element of elements) {
    const events = element[EVENTS_DATA]?.events;

    if (!events?.length) return;

    for (const event of events) {
      element.dispatchEvent(event);
    }

    delete element[EVENTS_DATA];
  }
}

export function removeEventsAction(container: HTMLElement): void {
  const elements = (container?.querySelectorAll(`[${repeatableAttribute}]`) ??
    []) as unknown as ElementWithEventsData[];

  for (const element of elements) {
    if (!element[EVENTS_DATA]) continue;

    eventsAction(element, true);
  }

  setTimeout(() => repeatEvents(elements), 0);
}

export const hasEventsAction = (element: Element): boolean => {
  const replayable =
    element.shadowRoot?.querySelectorAll<ElementWithEventsData>(
      `[${repeatableAttribute}]`
    ) ?? [];

  return [...replayable].some((el) => el[EVENTS_DATA]?.events?.length);
};

const test = treewalk;

export const addEventsActionInsertion = `
  const EVENTS_DATA = Symbol.for('${eventsDataIdentifier}');
  const repeatableAttribute = '${repeatableAttribute}';

  ${test.toString()}
  ${eventsAction.toString()}
  ${addEventsAction.toString()}

  addEventsAction();
`;

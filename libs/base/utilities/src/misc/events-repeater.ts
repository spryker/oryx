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
      element.removeEventListener(
        eventType.trim(),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

        element[EVENTS_DATA]?.events.unshift(event);
      },
    };

    eventsAction(element);
  }
}

export function removeEventsAction(container: HTMLElement): Event[][] {
  const elements = (container?.querySelectorAll(`[${repeatableAttribute}]`) ??
    []) as unknown as ElementWithEventsData[];
  const events = [];

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (!element[EVENTS_DATA]) continue;

    events[i] = element[EVENTS_DATA].events;
    eventsAction(element, true);
  }

  return events;
}

export function repeatEvents(container: HTMLElement, data?: Event[][]): void {
  if (!data?.length) return;

  const elements = (container?.querySelectorAll(`[${repeatableAttribute}]`) ??
    []) as unknown as ElementWithEventsData[];

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const events = data[i];

    if (!events?.length) return;

    for (const event of events) {
      element.dispatchEvent(event);
    }

    delete element[EVENTS_DATA];
  }
}

export const hasEventsAction = (element: Element): boolean => {
  const replayable =
    element.shadowRoot?.querySelectorAll<ElementWithEventsData>(
      `[${repeatableAttribute}]`
    ) ?? [];

  return [...replayable].some((el) => el[EVENTS_DATA]?.events?.length);
};

export const addEventsActionInsertion = `
  const EVENTS_DATA = Symbol.for('${eventsDataIdentifier}');
  const repeatableAttribute = '${repeatableAttribute}';

  ${treewalk.toString()}
  ${eventsAction.toString()}
  ${addEventsAction.toString()}

  addEventsAction();
`;

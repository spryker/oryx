const hydrationEventsIdentifier = 'ORYX.HYDRATION_EVENTS';
export const HYDRATE_EVENT = 'oryx.hydrate';
export const HYDRATION_EVENTS = Symbol.for(hydrationEventsIdentifier);
export const hydrationEventsAttribute = 'hydration-events';

interface HydrationEvents {
  listener: (event: Event) => void;
  events: Event[];
}

export type ElementWithHydrationEvents = HTMLElement & {
  [HYDRATION_EVENTS]?: HydrationEvents;
};

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

function parseHydrationEventsTypes(element: HTMLElement): string[] {
  return (element.getAttribute(hydrationEventsAttribute) ?? '').split(',');
}

function hydrationEventsAction(
  element: ElementWithHydrationEvents,
  shouldRemove?: true
): void {
  for (const event of parseHydrationEventsTypes(element)) {
    if (shouldRemove) {
      element.removeEventListener(
        event.trim(),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        element[HYDRATION_EVENTS]!.listener
      );
      continue;
    }

    element.addEventListener(
      event.trim(),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      element[HYDRATION_EVENTS]!.listener
    );
  }
}

export function stopEventsForHydration(): void {
  const elements = treewalk(
    `[${hydrationEventsAttribute}]`
  ) as ElementWithHydrationEvents[];

  for (const element of elements) {
    element[HYDRATION_EVENTS] = {
      events: [],
      listener: (event: Event) => {
        event.stopPropagation();
        event.preventDefault();
        element[HYDRATION_EVENTS]?.events.unshift(event);
        element.dispatchEvent(
          new CustomEvent(HYDRATE_EVENT, {
            bubbles: true,
            composed: true,
          })
        );
      },
    };

    hydrationEventsAction(element);
  }
}

const getHydrationElements = (
  shadowRoot: ShadowRoot
): ElementWithHydrationEvents[] => {
  return [
    ...(shadowRoot?.querySelectorAll<ElementWithHydrationEvents>(
      `[${hydrationEventsAttribute}]`
    ) ?? []),
  ];
};

export function enableEventsForHydration(
  container: ShadowRoot
): Event[][] | undefined {
  const elements = getHydrationElements(container);
  const events = [];

  if (elements.length === 0) return;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (!element[HYDRATION_EVENTS]) continue;

    events[i] = element[HYDRATION_EVENTS].events;
    hydrationEventsAction(element, true);
  }

  return events;
}

export function repeatHydrationEvents(
  container: ShadowRoot,
  data?: Event[][]
): void {
  if (!data?.length) return;

  const elements = getHydrationElements(container);

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const events = data[i];

    if (!events?.length) return;

    for (const event of events) {
      element.dispatchEvent(event);
    }

    delete element[HYDRATION_EVENTS];
  }
}

export const getHydrationEventsModes = (
  container: ShadowRoot,
  types: string[]
): string[] => {
  const events = getHydrationElements(container);

  if (!events.length) return types;

  const hasEvents = events.some((el) => el[HYDRATION_EVENTS]?.events?.length);

  if (hasEvents) types.push('window:load');

  return events.reduce<string[]>(
    (acc, element) => {
      for (const event of parseHydrationEventsTypes(element)) {
        if (!acc.includes(event.trim())) acc.push(event.trim());
      }

      return acc;
    },
    [...types, HYDRATE_EVENT]
  );
};

export const stopEventsForHydrationInsertion = `
  const HYDRATE_ON_DEMAND = '$__HYDRATE_ON_DEMAND';
  const HYDRATE_EVENT = '${HYDRATE_EVENT}';
  const HYDRATION_EVENTS = Symbol.for('${hydrationEventsIdentifier}');
  const hydrationEventsAttribute = '${hydrationEventsAttribute}';

  ${treewalk.toString()}
  ${parseHydrationEventsTypes.toString()}
  ${hydrationEventsAction.toString()}
  ${stopEventsForHydration.toString()}

  stopEventsForHydration();
`;

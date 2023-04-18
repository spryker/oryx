import { inject } from '@spryker-oryx/di';
import {
  combineLatest,
  map,
  Observable,
  shareReplay,
  Subscription,
} from 'rxjs';
import { ElementDefinition } from '../page-meta.model';
import { PageMetaService } from '../page-meta.service';
import {
  ElementResolver,
  PageMetaResolver,
  PageMetaResolverService,
} from './page-meta-resolver.service';

export class DefaultPageMetaResolverService implements PageMetaResolverService {
  protected data$ = combineLatest(
    this.resolvers.map((resolver) =>
      combineLatest([resolver.getScore(), resolver.resolve()]).pipe(
        map(([score, elements]) => ({
          score,
          elements: (Array.isArray(elements) ? elements : [elements]).reduce(
            this.resolversReducer,
            {}
          ),
        }))
      )
    )
  ).pipe(
    map((data) =>
      data
        .filter(({ score }) => score !== -1)
        .sort((a, b) => a.score - b.score)
        .reduce<Record<string, ElementDefinition>>((acc, { elements }) => {
          if (elements.html) {
            acc.html = {
              ...(acc.html ?? {}),
              ...elements.html,
              attrs: {
                ...(acc.html?.attrs ?? {}),
                ...elements.html.attrs,
              },
            };

            delete elements.html;
          }
          return { ...acc, ...elements };
        }, {})
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  protected subscription = new Subscription();

  constructor(
    protected meta = inject(PageMetaService),
    protected resolvers = inject(PageMetaResolver)
  ) {}

  initialize(): void {
    this.subscription.add(
      this.data$.subscribe((data) => {
        this.meta.add(Object.values(data), true);
      })
    );
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTitle(): Observable<string | undefined> {
    return this.data$.pipe(map((data) => data.title.attrs.text));
  }

  protected resolversReducer(
    acc: Record<string, ElementDefinition>,
    element: ElementResolver
  ): Record<string, ElementDefinition> {
    let tagName;
    let attrs = {};

    if (!element.name) {
      tagName = Object.keys(element).find((_el) =>
        ['link', 'style', 'title', 'script'].includes(_el)
      );
      const tagProperty = element[tagName as keyof ElementResolver];
      attrs =
        tagName === 'link' ? { href: tagProperty } : { text: tagProperty };
    }

    return {
      ...acc,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      [element.id ?? tagName ?? element.name!]: {
        name: tagName || element.name,
        ...element,
        attrs: {
          ...attrs,
          ...element.attrs,
        },
      } as ElementDefinition,
    };
  }
}

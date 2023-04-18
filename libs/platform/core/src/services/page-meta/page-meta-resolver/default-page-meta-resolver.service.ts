import { inject } from '@spryker-oryx/di';
import {
  combineLatest,
  defer,
  map,
  Observable,
  shareReplay,
  Subscription,
} from 'rxjs';
import { ElementDefinition } from '../page-meta.model';
import { PageMetaService } from '../page-meta.service';
import { ResolverScore } from './page-meta-resolver.model';
import {
  PageMetaResolver,
  PageMetaResolverService,
} from './page-meta-resolver.service';

export class DefaultPageMetaResolverService implements PageMetaResolverService {
  protected data$ = defer(() =>
    combineLatest(
      this.resolvers.map((resolver) =>
        combineLatest([resolver.getScore(), resolver.resolve()])
      )
    ).pipe(
      map((data) => {
        const _data = data
          .filter(([score]) => score > ResolverScore.NotUsed)
          .sort(([aScore], [bScore]) => aScore - bScore)
          .reduce((acc, [score, elements]) => ({ ...acc, ...elements }), {});

        return Object.entries(_data).map(([name, content]) => ({
          name,
          attrs: { ...(name === 'title' ? { text: content } : { content }) },
        })) as ElementDefinition[];
      })
    )
  ).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  protected subscription = new Subscription();

  constructor(
    protected meta = inject(PageMetaService),
    protected resolvers = inject(PageMetaResolver)
  ) {}

  initialize(): void {
    this.subscription.add(this.data$.subscribe((data) => this.meta.add(data)));
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTitle(): Observable<string | undefined> {
    return this.data$.pipe(
      map((data) => data.find((el) => el.name === 'title')?.attrs.text)
    );
  }
}

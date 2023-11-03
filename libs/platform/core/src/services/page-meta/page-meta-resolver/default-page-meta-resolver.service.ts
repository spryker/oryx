import { inject } from '@spryker-oryx/di';
import {
  combineLatest,
  defer,
  map,
  Observable,
  pairwise,
  shareReplay,
  Subscription,
  tap,
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
        combineLatest([
          resolver.getScore().pipe(
            map((score) => {
              if (Array.isArray(score)) return score.filter((x) => !!x).length;

              return score;
            })
          ),
          resolver.resolve(),
        ])
      )
    ).pipe(
      map((data) =>
        data
          .filter(([score]) => score !== ResolverScore.NotUsed)
          .sort(([aScore], [bScore]) => aScore - bScore)
          .reduce((acc, [_, elements]) => ({ ...acc, ...elements }), {})
      )
    )
  ).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  protected newData$ = this.data$.pipe(
    map(this.normalize),
    tap((data) => this.meta.add(data))
  );
  protected oldData$ = this.data$.pipe(
    pairwise(),
    map(([oldData, newData]) => {
      for (const key of Object.keys(newData)) {
        if (
          newData[key as keyof typeof newData] !==
          oldData[key as keyof typeof oldData]
        )
          continue;

        delete oldData[key as keyof typeof oldData];
      }

      return this.normalize(oldData);
    }),
    tap((data) => this.meta.remove(data))
  );
  protected subscription = new Subscription();

  constructor(
    protected meta = inject(PageMetaService),
    protected resolvers = inject(PageMetaResolver, [] as PageMetaResolver[])
  ) {}

  initialize(): void {
    this.subscription.add(this.oldData$.subscribe());
    this.subscription.add(this.newData$.subscribe());
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTitle(): Observable<string | undefined> {
    return this.newData$.pipe(
      map((data) => data.find((el) => el.name === 'title')?.attrs.text)
    );
  }

  protected normalize(data: Record<string, string>): ElementDefinition[] {
    return Object.entries(data).map(([name, content]) => {
      if (name === 'description' && (content as string)?.length > 400)
        content = `${(content as string).substring(0, 400)}...`;

      return {
        name,
        attrs: { ...(name === 'title' ? { text: content } : { content }) },
      };
    });
  }
}

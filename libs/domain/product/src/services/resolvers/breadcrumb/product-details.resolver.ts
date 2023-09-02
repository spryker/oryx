import { Provider, inject } from '@spryker-oryx/di';
import { RouteType, RouterService } from '@spryker-oryx/router';
import {
  BreadcrumbItem,
  BreadcrumbResolver,
  BreadcrumbResolvers,
  LinkService,
} from '@spryker-oryx/site';
import {
  Observable,
  combineLatest,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { Product, ProductCategory } from '../../../models';
import { ProductService } from '../../product.service';

export class ProductDetailsBreadcrumbResolver implements BreadcrumbResolver {
  constructor(
    protected routerService = inject(RouterService),
    protected linkService = inject(LinkService),
    protected productService = inject(ProductService)
  ) {}

  resolve(): Observable<BreadcrumbItem[]> {
    return this.routerService
      .current()
      .pipe(
        switchMap(({ params }) =>
          this.productService
            .get({ sku: params.sku as string })
            .pipe(
              switchMap((product) =>
                product
                  ? this.generateBreadcrumbTrail(product)
                  : throwError(() => new Error('Product not found'))
              )
            )
        )
      );
  }

  protected generateBreadcrumbTrail(
    product: Product,
    targetCategoryId?: string
  ): Observable<BreadcrumbItem[]> {
    const { categories } = product;

    if (
      !categories ||
      (targetCategoryId &&
        !categories.find((cat) => cat.id === targetCategoryId))
    ) {
      return of([this.productTitle(product)]);
    }

    const trails = this.collectPossibleTrails(categories);
    const trail = this.getLongestTrail(trails, targetCategoryId);

    return combineLatest([
      ...trail.map((id) =>
        this.linkService.get({ id, type: RouteType.Category }).pipe(
          map((url) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const name = categories.find((cat) => cat.id === id)!.name;
            return { text: { raw: name }, url };
          })
        )
      ),
      of(this.productTitle(product)),
    ]);
  }

  protected productTitle(product: Product): BreadcrumbItem {
    return { text: { raw: product.name as string } };
  }

  protected collectPossibleTrails(categories: ProductCategory[]): string[][] {
    const trails: string[][] = [];

    const collectTrails = (collected: string[]): string[][] | void => {
      const lastId = collected[collected.length - 1];
      const lastCat = categories.find((cat) => cat.id === lastId);

      if (lastCat?.children.length) {
        lastCat.children.forEach((id) => {
          if (!categories.find((cat) => cat.id === id)) return;
          collectTrails([...collected, id]);
        });
        return;
      }

      trails.push(collected);
    };

    categories.forEach((cat) => {
      collectTrails([cat.id]);
    });

    return trails;
  }

  protected getLongestTrail(
    trails: string[][],
    targetCategoryId?: string
  ): string[] {
    return (
      targetCategoryId
        ? trails.filter((trail) => trail.includes(targetCategoryId as string))
        : trails
    ).sort((a, b) => b.length - a.length)[0];
  }
}

export const ProductDetailsBreadcrumb: Provider = {
  provide: `${BreadcrumbResolvers}${RouteType.Product}`,
  useClass: ProductDetailsBreadcrumbResolver,
};

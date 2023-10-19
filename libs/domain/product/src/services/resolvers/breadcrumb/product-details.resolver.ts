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
  delay,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { Product, ProductCategory } from '../../../models';
import { ProductCategoryService } from '../../category';
import { ProductService } from '../../product.service';

export class ProductDetailsBreadcrumbResolver implements BreadcrumbResolver {
  constructor(
    protected routerService = inject(RouterService),
    protected linkService = inject(LinkService),
    protected productService = inject(ProductService),
    protected categoryService = inject(ProductCategoryService)
  ) {}

  resolve(): Observable<BreadcrumbItem[]> {
    return this.routerService.current().pipe(
      switchMap(({ params }) =>
        this.productService
          .get({ sku: (params.sku as string).split(',')[0] })
          .pipe(
            //add a delay to make sure that categories data are already populated
            //from product's included resources and stored in category service
            //before the trail is requested
            delay(0),
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
    product: Product
  ): Observable<BreadcrumbItem[]> {
    const { categoryIds } = product;

    if (!categoryIds?.length) {
      return of([this.productTitle(product)]);
    }

    return combineLatest(
      categoryIds.map((id) => this.categoryService.getTrail(id))
    ).pipe(
      switchMap((trails) =>
        combineLatest([
          ...this.getLongestTrail(trails).map(({ id, name }) =>
            this.linkService
              .get({ id, type: RouteType.Category })
              .pipe(map((url) => ({ text: { raw: name }, url })))
          ),
          of(this.productTitle(product)),
        ])
      )
    );
  }

  protected productTitle(product: Product): BreadcrumbItem {
    return { text: { raw: product.name as string } };
  }

  protected getLongestTrail(trails: ProductCategory[][]): ProductCategory[] {
    return trails.sort((a, b) => b.length - a.length)[0];
  }
}

export const ProductDetailsBreadcrumb: Provider = {
  provide: `${BreadcrumbResolvers}${RouteType.Product}`,
  useClass: ProductDetailsBreadcrumbResolver,
};

import { HttpHandlerFn, HttpInterceptor } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { ApiCartModel } from '../../../models';

export class CartVersionInterceptor implements HttpInterceptor {
  protected parameterName = 'priceMode';

  constructor(protected SCOS_BASE_URL = inject('SCOS_BASE_URL')) {}

  intercept(req: Request, handle: HttpHandlerFn): Observable<Response> {
    return handle(req).pipe(
      switchMap((response) =>
        combineLatest([response.clone().json(), of(response)])
      ),
      map(([body, response]) => {
        const version = response.headers.get('etag');

        if (version) {
          return new Response(
            JSON.stringify({
              ...body,
              data: this.addEtagToData(body.data, version),
            }),
            response
          );
        }

        return response;
      })
    );
  }

  shouldInterceptRequest({ url }: Request): boolean {
    if (!this.SCOS_BASE_URL || !url.startsWith(this.SCOS_BASE_URL))
      return false;

    const path = url.substring(this.SCOS_BASE_URL.length);

    if (path.includes(`/${ApiCartModel.UrlParts.Carts}`)) return true;

    return false;
  }

  protected addEtagToData(
    data: (ApiCartModel.Response | ApiCartModel.ResponseList)['data'],
    version: string
  ): (ApiCartModel.Response | ApiCartModel.ResponseList)['data'] {
    return Array.isArray(data)
      ? data.map((_d) => ({ ..._d, attributes: { ..._d.attributes, version } }))
      : { ...data, attributes: { ...data.attributes, version } };
  }
}

# Interceptors

Often behavior for receiving or sending HTTP requests is needed for enhancing. Interceptors allows to intercept incoming (or outgoing) HTTP requests using the `HttpService`.

HTTP interceptors will always be in the middle of any single HTTP request. These services will intercept all requests performed by the app, allowing to perform many operations on them before they are sent to the server. Functions include adding a custom HTTP header to the final outgoing request (e.g. adding an authorization header and passing an authorization token on all endpoints requiring a set of permissions, etc.), caching, logging to collect metrics, error handling, etc.

## Providing

Providing interceptors is possible through DI by `HttpInterceptor` which is multiple (see multiple token doc). Order of interceptors is important. `Request` will be intercepted by the order from the first one registered and to the last one when `response` in reverse order.

```ts
createInjector({
  providers: [
    {
      provide: HttpInterceptor,
      useClass: CustomInterceptor,
    },
  ],
});
```

## Implementation

To create an interceptor, `HttpInterceptor` interface should be implemented into service. Most interceptors transform the outgoing request before passing it to the next interceptor in the chain, by calling `handle(url, options)`. An interceptor may transform the response event stream as well, by applying additional RxJS operators on the stream returned by handle().

```ts
export class NewInterceptor implements HttpInterceptor {
  intercept(
    url: string,
    options: RequestOptions,
    handle: HttpHandlerFn
  ): Observable<Response> {
    options.header.newHeader = 'newHeader';

    return handle(url, options).pipe(/* transform the response */);
  }
}
```

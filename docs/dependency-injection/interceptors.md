# HTTP Interceptors

HTTP interceptors let you capture or change every request or response performed by the app. They are used when there is a need to modify HTTP calls globally, for example when performing authorization, error handling, or metrics collection.

HTTP interceptors always function in the middle of a single HTTP request and usually modify the outgoing request. These services intercept all requests performed by the app, and perform designated operations on the requests before they are sent to the server. HTTP interceptors can be used to perform the following operations:
* adding a custom HTTP header to the final outgoing request – for example, adding an authorization header and passing an authorization token to all endpoints requiring permissions.
* caching.
* logging to collect metrics.
* error handling.
* other modifications.
 
An interceptor may also transform the response event stream.

Interceptors permit you to intercept incoming and outgoing HTTP requests using the HttpService.

## Set up a custom interceptor

Providing interceptors is possible through dependency injection by `HttpInterceptor`, which accepts multiple values. See [Multi Providers](fes/docs/dependency-injection/multi-providers.html) for more information. The order of interceptors is important. `Request` will be intercepted in order from the first one registered to the last one. `Response` will be intercepted in reverse order.

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

To create an interceptor, `HttpInterceptor` interface is implemented. Most interceptors transform the outgoing request before passing it to the next interceptor in the chain, by calling `handle(url, options)`. 

An interceptor may transform the response event stream as well, by applying additional RxJS operators on the stream returned by `handle()`.

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

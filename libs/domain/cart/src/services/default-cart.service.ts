/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IdentityService } from '@spryker-oryx/auth';
import {
  Command,
  createCommand,
  createEffect,
  createQuery,
  QueryService,
  QueryState,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { subscribeReplay } from '@spryker-oryx/utilities';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  scan,
  shareReplay,
  skip,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import {
  AddCartEntryQualifier,
  Cart,
  CartEntry,
  CartEntryQualifier,
  CartQualifier,
  UpdateCartEntryQualifier,
} from '../models';
import { CartAdapter } from './adapter/cart.adapter';
import { CartService } from './cart.service';
import {
  CartEntryRemoved,
  CartModificationEnd,
  CartModificationFail,
  CartModificationStart,
  CartModificationSuccess,
  CartQuery,
  CartsUpdated,
} from './state';

export class DefaultCartService implements CartService {
  // TODO: find a better fix for storybook
  protected adapter = inject(CartAdapter);
  protected identity = inject(IdentityService);
  protected query = inject(QueryService);

  protected cartCommandBase = {
    onStart: [CartModificationStart],
    onFinish: [CartModificationEnd],
    onSuccess: [CartModificationSuccess],
    onError: [CartModificationFail],
  };

  protected cartsQuery$ = createQuery({
    loader: () => this.adapter.getAll(),
    onLoad: [
      ({ data: carts }) => {
        carts?.forEach((cart) => {
          this.cartQuery$.set({ data: cart, qualifier: { cartId: cart.id } });
        });
      },
    ],
    resetOn: [this.identity.get().pipe(skip(1))],
    refreshOn: [CartsUpdated],
  });

  protected cartQuery$ = createQuery({
    id: CartQuery,
    loader: (qualifier: CartQualifier) => this.adapter.get(qualifier),
    refreshOn: [CartEntryRemoved, LocaleChanged],
  });

  protected addEntryCommand$ = createCommand({
    ...this.cartCommandBase,
    action: (qualifier: AddCartEntryQualifier) => {
      return this.adapter.addEntry(qualifier);
    },
  });

  protected removeEntryCommand$ = createCommand({
    ...this.cartCommandBase,
    action: (qualifier: CartEntryQualifier) => {
      return this.adapter.deleteEntry(qualifier);
    },
    onSuccess: [...this.cartCommandBase.onSuccess, CartEntryRemoved],
  });

  protected updateEntryCommand$ = createCommand({
    ...this.cartCommandBase,
    action: (qualifier: UpdateCartEntryQualifier) => {
      return this.adapter.updateEntry(qualifier);
    },
  });

  protected updateAfterModification$ = createEffect<Cart>([
    CartModificationSuccess,
    ({ event }) => {
      if (event.data)
        // Use result of modification commands to update cart state
        this.cartQuery$.set({
          data: event.data,
          qualifier: { cartId: event.data.id },
        });
    },
  ]);

  update(data: Cart): Observable<Cart | undefined> {
    if (data) {
      subscribeReplay(
        this.getCart().pipe(
          take(1),
          switchMap((cart) => {
            return this.adapter.update({
              cartId: cart?.id,
              priceMode: data?.priceMode,
              version: cart?.version,
            });
          })
        )
      );
    }

    return of(undefined);
  }

  protected isCartModified$ = createEffect<Cart>(({ getEvents }) =>
    getEvents([CartModificationStart, CartModificationEnd]).pipe(
      scan(
        (acc, event: CartModificationStart | CartModificationEnd) =>
          event.type === CartModificationStart ? ++acc : --acc,
        0
      ),
      map(Boolean)
    )
  ) as Observable<boolean>;

  protected entryBusyState$ = createEffect<Cart>(({ getEvents }) =>
    getEvents([CartModificationStart, CartModificationEnd]).pipe(
      filter(
        (event: CartModificationStart | CartModificationEnd) =>
          !!event.qualifier?.groupKey
      ),
      scan((acc, event) => {
        if (event.type === CartModificationStart) {
          acc.set(
            (event as CartModificationStart).qualifier!.groupKey!,
            (acc.get((event as CartModificationStart).qualifier!.groupKey!) ??
              0) + 1
          );
        } else {
          const newValue = (acc.get(event.qualifier!.groupKey!) ?? 0) - 1;
          if (newValue > 0) {
            acc.set(event.qualifier!.groupKey!, newValue);
          } else {
            acc.delete(event.qualifier!.groupKey!);
          }
        }
        return acc;
      }, new Map<string, number>())
    )
  ) as Observable<Map<string, number>>;

  protected activeCartId$ = this.cartsQuery$.get().pipe(
    map((carts) => {
      for (const cart of carts ?? []) {
        if (cart.isDefault) {
          return cart.id;
        }
      }
      return carts?.[0]?.id ?? null;
    }),
    switchMap((id) =>
      id
        ? of(id)
        : // we want to wait for the first cart to be created
          this.query.getEvents(CartModificationSuccess).pipe(
            map((event: CartModificationSuccess) => (event.data as Cart)?.id),
            filter(Boolean),
            startWith(null)
          )
    ),
    shareReplay(1)
  );

  protected isBusy$ = combineLatest([
    this.cartsQuery$.getState(), // loading state of all carts
    this.getCartState().pipe(startWith({ loading: false } as QueryState<Cart>)), // loading state of the active cart
    this.isCartModified$.pipe(startWith(false)), // is any cart being modified
  ]).pipe(
    map(
      ([cartsState, cartState, isCartModified]) =>
        cartsState.loading || cartState.loading || isCartModified
    ),
    distinctUntilChanged()
  );

  getCart(qualifier?: CartQualifier): Observable<Cart | undefined> {
    if (qualifier?.cartId) {
      return this.cartQuery$.get(qualifier);
    }

    return this.activeCartId$.pipe(
      switchMap((id) =>
        id ? this.cartQuery$.get({ cartId: id! }) : of(undefined)
      )
    );
  }

  getCartState(qualifier?: CartQualifier): Observable<QueryState<Cart>> {
    if (qualifier?.cartId) {
      return this.cartQuery$.getState(qualifier);
    }

    return this.activeCartId$.pipe(
      switchMap((id) => this.cartQuery$.getState({ cartId: id! }))
    );
  }

  getEntries(data?: CartQualifier): Observable<CartEntry[]> {
    return this.getCart(data).pipe(map((cart) => cart?.products ?? []));
  }

  isEmpty(data?: CartQualifier): Observable<boolean> {
    return this.getEntries(data).pipe(map((entries) => !entries?.length));
  }

  protected executeWithOptionalCart<Qualifier extends CartQualifier, Result>(
    qualifier: Qualifier,
    command: Command<Result, Qualifier>
  ): Observable<Result> {
    if (!qualifier.cartId) {
      return subscribeReplay(
        this.activeCartId$.pipe(
          take(1),
          switchMap((cartId) =>
            command.execute({
              ...qualifier,
              cartId,
            })
          )
        )
      );
    }

    return command.execute(qualifier);
  }

  addEntry(qualifier: AddCartEntryQualifier): Observable<unknown> {
    return this.executeWithOptionalCart(qualifier, this.addEntryCommand$);
  }

  deleteEntry(qualifier: CartEntryQualifier): Observable<unknown> {
    return this.executeWithOptionalCart(qualifier, this.removeEntryCommand$);
  }

  updateEntry(qualifier: UpdateCartEntryQualifier): Observable<unknown> {
    return this.executeWithOptionalCart(qualifier, this.updateEntryCommand$);
  }

  isBusy({ groupKey }: CartEntryQualifier = {}): Observable<boolean> {
    if (groupKey) {
      return this.entryBusyState$.pipe(
        map((state) => state.has(groupKey)),
        distinctUntilChanged()
      );
    }

    //TODO: support for multiple carts has to be implemented (cartId qualifier is ignored currently)
    return this.isBusy$;
  }
}

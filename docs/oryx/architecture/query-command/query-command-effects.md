---
title: Effect Management
description: Unpack Effect Management in Oryx, enhancing your application’s reactivity and data flow management through use of callback and stream effects, responding dynamically to events and state changes.
---

Utilize effects to create a seamless, reactive connection between events, queries, and commands in the Oryx framework.

# Creating Callback Events

Callback events invoke a defined logic that may include state updates or auxiliary event dispatches, based on provided data and qualifiers from the triggered event.

Example:

```ts
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
```

The effect listens for a specific event and executes logic using event data and qualifier, demonstrating a mechanism to execute operations upon event triggering.

# Stream Effect for Enhanced Reactive Logic

Unlike callback effects, stream effects leverage Observables, enabling more complex, reactive logic that responds to a continuous event stream.

- Use `events$` to access all events as an observable stream.
- `getEvents` utility filters or specifies events to shape the reactive logic and narrow reactivity scope.

Example:

```ts
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
```

The effect utilizes `getEvents`, listens for specific events, manipulates its internal state in response, and outputs an observable indicating the ongoing cart modification status.

---
title: Queries in Oryx
description: A detailed overview of utilizing Queries in Oryx to manage, retrieve, and monitor data, alongside optimizing performance through caching, qualifiers, and strategic data retrieval methods.
---

Oryx **Queries** provide a method to expose and manipulate backend state, offering structured data retrieval and management. The `QueryOptions` interface specifies a set of options that control data fetching and state updates, enabling a declarative model for data interaction, managing resets and refresh operations, and handling life cycle events through specified handlers. Subsequent sections will detail the configuration and use of Queries in Oryx to manage backend states effectively.

# Defining a Query

Example:

```ts
  protected cartQuery$ = createQuery({
    loader: (qualifier: CartQualifier) => this.adapter.get(qualifier),
    refreshOn: [CartEntryRemoved, LocaleChanged],
  });
```

In the above code snippet, `cartQuery$` is instantiated through the `createQuery` function. The `loader` function, accepting a `CartQualifier`, uses it in a data retrieval call `this.adapter.get(qualifier)`. `refreshOn` specifies conditions (`CartEntryRemoved` or `LocaleChanged` events) under which the query should automatically re-fetch the data, ensuring state consistency.

# Working with a Query

Interaction with the backend state is achievable through methods provided by `this.cartQuery$`:

## Fetching Data

- **`.get(qualifier?)`**: Returns an observable of the data. Optionally accepts a `qualifier` to fetch condition-based data.

## Accessing Query State

- **`.getState(qualifier?)`**: Delivers an observable of the entire query state, including data and associated metadata.

# Qualifier

The `Qualifier` in Oryx queries, while optional, provides a mechanism to conditionally handle data retrieval and management. It is an object that may contain various properties utilized to distinguish between different states or data sets within a query. Examples of such properties could be `cartId` for distinguishing between different carts or `sku` for different products. Importantly, Oryx manages queries by caching them per `Qualifier`, ensuring each unique `Qualifier` retains its associated data state and reducing redundant data fetches.

# Query Specificity

Oryx queries are constructed on observables and adhere to a caching mechanism to optimize data retrieval and management. Data loading via queries occurs singularly per query and is cached thereafter, minimizing superfluous data operations. This loading, as well as the refreshing of data, is only performed when the observable is in use—that is, there's an active subscription to it.

## Refresh vs. Reload

- **Refresh**: This operation reloads the query in the background, updating the stored value with new data without clearing the previous data first.
- **Reload**: This operation clears the current query, then reloads it in the background.

Your use case will determine whether `refresh` or `reload` is the optimal choice. Generally, `reload` might be preferable in scenarios where the existing data becomes invalid or incorrect in a shifting context.

# Advanced Query Options

Oryx queries offer advanced configuration options to enable specific behaviors during query operation.

## Event Handling: `onLoad` and `onError`

Oryx queries provide two event handlers: `onLoad` and `onError` for performing actions upon data load success and error, respectively. Both handlers can utilize two approaches:

### 1. Dispatching a State Event

Simply pass an event name, and it will be dispatched when the event occurs.

```ts
onLoad: [ProductsLoaded],
```

### 2. Using a Callback

Define a callback function to have direct interaction with the loaded data. In both methodologies, the event and the callback receive `data` (result of the load) and `qualifier` (if provided) as parameters.

```ts
onLoad: [
  ({ data: carts }) => {
    carts?.forEach((cart) => {
      this.cartQuery$.set({ data: cart, qualifier: { cartId: cart.id } });
    });
  },
],
```

## Experimental Options: `volatile` and `permanent`

### `volatile: boolean`

When set to `true`, the query will not cache the data between subscriptions, and upon each subscription, data will be fetched anew.

### `permanent: boolean`

If set to `true`, the query will persistently refresh data even without active subscriptions, maintaining up-to-date data readiness for any subsequent subscriptions.

# Advanced Query Methods

Utilization of specific query methods may not be frequent but can be crucial for certain scenarios like updating one query with data from another.

## Update Method

- **`.set(data)`**: Alters query data. Accepts a value or a function that derives a new value from the previous state. Can also utilize `qualifier` and `optimistic` parameters. When `optimistic` is true, the query data updates and marks as stale, initiating a background refresh to synchronize with actual backend data.

## Data Management Methods

- **`.reset(qualifier?)`** and **`.refresh(qualifier?)`**: Perform data deletion or re-fetching operations, respectively, with an optional `qualifier`.

# Next step

[Commands in Oryx](/docs/oryx/architecture/query-command/query-command-command.md)

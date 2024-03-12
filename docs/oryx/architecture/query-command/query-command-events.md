---
title: Query Events
description: Dive into the reactive world of Query Events in Oryx, understanding the role, implementation, and connectivity of events in governing interactions and data exchanges within your application layers.
---

In Oryx, Query Events form a pivotal mechanism to bridge and manage interactions between queries and commands.

# Event Typology and Structuring

An event within Oryx is structured as an object, typically composed of a `type` attribute, and optionally, `data`, `error`, and `qualifier` attributes. Here's a basic formulation of a Query Event:

```ts
export interface QueryEvent<Data = unknown, Qualifier = unknown> {
  type: string;
  data?: Data;
  error?: any;
  qualifier?: Qualifier;
}
```

Where:

- `type`: A string defining the event identity.
- `data`: Optionally carries data relevant to the event, usually query data result of command execution.
- `error`: Conveys error information if applicable.
- `qualifier`: Optionally, assists in defining or scoping the event, usually qualifier for related command or query.

# Event Utilization in Queries

## Triggering Refresh/Reload

Events can be utilized to enforce query refreshes or reloads. By binding certain events to the `refreshOn` or `reloadOn` options in a query, you direct the query to refetch data upon their invocation, ensuring data integrity and synchronization.

## Listening to and Managing Commands

Commands and their execution states can be communicated through events, which can then be listened for by queries, enabling them to react, update, or manage their state in accordance to the outcomes or states of the commands.

## Reacting to Query Evens using Effects

In the ensuing content, we’ll dive into the detailed operations and configurations of effects, providing a deeper understanding of how to optimally leverage events for customizing and managing your application’s behavior.

# Next step

[Query Effects in Oryx](/docs/oryx/architecture/query-command/query-command-effects.md)

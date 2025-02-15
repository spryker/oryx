---
title: Commands in Oryx
description: Explore Commands in Oryx as a mechanism to manipulate, validate, and manage actions and data mutations, ensuring a consistent and reliable approach to altering application state and data layers.
---

Oryx Commands facilitate the structured execution of actions that interact with or modify the backend state while ensuring adaptability across different execution scenarios via various strategies. Commands are constructed using the `CommandOptions` interface, which encapsulates an `action` – a function that performs the actual backend interaction, and optionally, various event handlers that respond to different stages of the command’s lifecycle.

# Defining a Command

Example:

```ts
  protected addAddressCommand$ = createCommand({
    action: (qualifier: Address) => {
      return this.adapter.add(qualifier);
    },
    onSuccess: [AddressModificationSuccess],
  });
```

In this instantiation, `addAddressCommand$` is constructed using Oryx's `createCommand` function. The `action` takes a qualifier of type `Address` and uses it to add an address through `this.adapter.add(qualifier)`. If the action is successful, an event specified in the `onSuccess` parameter, `AddressModificationSuccess`, is triggered.

# Working with Commands

Executing a command in Oryx involves using the `execute` method:

```ts
this.addAddressCommand$.execute(qualifier);
```

Calling `execute` and passing an optional `qualifier` as an argument initiates the command and returns an `Observable<ResultType>`. This observable emits the results of the command execution, providing a means for subscribers to respond to the outcome.

It's important to note, that subscribing to the returned observable is optional. Just simple call to `execute` is enough to initiate the command.

# Command Strategies

Strategies for managing concurrent execution of commands are defined in the `CommandStrategy` enum, providing varied behaviors for consecutive command invocations:

- **Queue**: Execute commands sequentially.
- **Parallel**: Allow concurrent execution of commands.
- **Replace**: The new command cancels the preceding one.
- **Override**: The new command cancels and errors the preceding one.
- **Skip**: The new command is ignored if a preceding one is still ongoing.
- **Cancel**: An error is thrown if a new command is issued while a preceding one is still ongoing.

# Command Events

The available events to hook for commands are:

- **onStart**: Triggered when the command begins execution.
- **onFinish**: Fired when the command concludes its execution, regardless of success or failure.
- **onError**: Invoked when the command encounters an error during execution.
- **onSuccess**: Executed upon successful completion of the command.

Each event handler can leverage both the result data (`ResultType`) and the qualifier (`Qualifier`) utilized during the command’s execution, affording context-aware capabilities for response logic.

```ts
protected exampleCommand$ = createCommand({
  action: (qualifier: ExampleQualifier) => this.adapter.exampleAction(qualifier),
  onStart: [
    ExampleStartEvent,
    ({ data, qualifier }) => {
      console.log('Command started', data, qualifier);
    }
  ],
});

```

In the scenario where an event is simply an event name, Oryx will dispatch that event upon the respective phase of the command’s lifecycle. Conversely, when utilizing a callback, it receives an object with `data` and `qualifier` properties, providing contextual data relevant to the command execution stage, enabling dynamic and informed decision-making within the event response logic.

This flexibility in event handling allows developers to intertwine commands with application logic seamlessly, ensuring coherent interaction with backend states and user interfaces.

# Next step

[Query Events in Oryx](/docs/oryx/architecture/query-command/query-command-events.md)

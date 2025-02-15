---
title: Introduction to Query & Command in Oryx
description: Navigate the foundational aspects of employing Query and Command patterns in Oryx, ensuring efficient data management and streamlined application logic in your projects.
---

Oryx offers a streamlined and robust approach to managing backend state through its **Query** and **Command** functionality. This system allows developers to interact with and manipulate the backend in a declarative, consistent, and bulletproof manner.

# Why Use Query & Command?

- **Declarative Nature**: Define _what_ you want to do without getting bogged down with _how_ to do it.
- **Consistency**: Establish a uniform method for handling backend state across your application.
- **Control**: Perform actions and modify the backend system in a structured and controlled way.

# Key Concepts

## Query

Queries expose some portion of the backend state and provide a means to interact with it:

- **State Exposure**: Directly expose parts of the backend state.
- **Qualifiers**: Accept qualifiers to refine the exposed state.
- **Refresh & Reload**: Easily refresh or reload the queried state.

## Command

Commands perform actions and alterations on the backend state:

- **Action Execution**: Execute specific actions on the backend.
- **Result Return**: Optionally return a result from the executed action.
- **Debounce & Queue**: Facilitate easy debouncing or queuing of actions.

## QueryEvent

QueryEvents are utilized to manage query interactions and updates:

- **Trigger Refresh/Reload**: Invoke a query refresh or reload.
- **Listen for Commands**: Receive and handle command executions.
- **Link Commands with Queries**: Connect specific commands to relevant queries.

## Effect

Effects enable responsive behavior to QueryEvents:

- **React to QueryEvents**: Easily setup reactions to specific QueryEvents.

In the following chapters, we'll dive deeper into each concept, exploring how they intertwine to provide a cohesive system for managing backend state and actions within the Oryx framework.

## Next step

[Queries in Oryx](/docs/oryx/architecture/query-command/query-command-query.md)

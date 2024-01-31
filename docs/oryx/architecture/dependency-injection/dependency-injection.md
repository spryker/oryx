---
title: Dependency injection
description: Dependency injection lets you customize logic but keep your project upgradable
template: concept-topic-template
last_updated: Apr 13, 2023
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/dependency-injection/dependency-injection.html
---


Dependency injection (DI) is a design pattern that provides loosely-coupled, maintainable, and testable code. It improves modularity, maintainability, testability, and is easily customizable and extensible.

In the context of Oryx, DI enables you to customize logic deep inside the framework, which is particularly useful for projects with complex or rapidly-evolving requirements. Without DI, you need to override large portions of the logic or create a lot of boilerplate code. By leveraging DI, you can override logic while still being able to upgrade to new versions of Oryx.

The key advantage of using Oryx's DI implementation is that it is vanilla JavaScript and can be used in other frameworks as well. Although there are popular DI packages available, using Oryx's implementation ensures seamless integration and compatibility with its features.

## Next step

[Oryx service layer](/docs/oryx/architecture/dependency-injection/oryx-service-layer.md)

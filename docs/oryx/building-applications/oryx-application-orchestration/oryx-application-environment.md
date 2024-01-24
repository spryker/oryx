---
title: Oryx application environment
description: Environment of the Oryx Application
template: concept-topic-template
redirect_from:
  - /docs/scos/dev/front-end-development/202311.0/oryx/oryx-application-orchestration/oryx-application-environment.html
---



`AppEnvironment` represents environment variables that are used in an Oryx application. It's a typesafe global object that can be extended wherever an environment variable is needed for a feature to work properly.

To pass an actual environment object, use the `AppBuilder.withEnvironment()` API and the method of accessing environment variables specific to your build:

```ts
import { appBuilder } from '@spryker-oryx/core';

appBuilder().withEnvironment(import.meta.env); // or process.env in NodeJS style apps
```

{% info_block warningBox "" %}

When you are using environment variables directly, like `import.meta.env`, they may end up in your application bundle. This may leak confidential information to public if your application is deployed to a public internet. So make sure you are filtering your environment variables in the build step. For example, by using `envPrefix` in Vite build config.

{% endinfo_block %}

To declare a new environment variable, use the `AppEnvironment` global interface with your custom environment variable name and type:

```ts
declare global {
  interface AppEnvironment {
    readonly MY_VAR?: string;
  }
}
```

Make sure to mark it as optional, as the Oryx framework does not guarantee that any environment variable will be present in the runtime. Also, in most cases, set `string` as a type for environment variables as most of the environments are exposed as strings and Oryx framework does not perform any typechecks or type conversions.

To access an environment variable, use the `injectEnv` API:

```ts
import { injectEnv } from '@spryker-oryx/core';

class MyService {
  constructor(myVar = injectEnv('MY_VAR', 'optional-fallback')) {}
}
```

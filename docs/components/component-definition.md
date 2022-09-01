# Component definition

## Selector

Web components require a so-called namespace to distinguish components. We'll use `oryx` as the selector prefix. Additionally, when components are part of a domain (product, search, cart, etc), they will get an additional _domain_ prefix.

The domain component selector looks like: <sup>[1]</sup>

```
<oryx-[domain]-[feature]>
```

Examples of domain component selectors are `<oryx-product-title>`, `<oryx-cart-totals>` or `<oryx-content-image>`.

Low level UI components (i.e. button) will not have a domain, for example `<oryx-button>` or `<oryx-select>`.

<sup>[1]</sup> We have not yet implemented the `oryx` prefix so far.
Some of the components do not follow the naming convention yet.

## Directory structure

Components have their own directory. The directory typically contains a single component, unless the component is composed of several sub-components that are not reusable. This pattern is rarely used, but is useful when components are composed to keep the main implementation clean.

In a directory, there are a number of typical files present. The feature name is used as a prefix for most files.

```
feature
|-- index.ts
|-- src
    |-- index.ts
    |-- feature.def.ts
    |-- feature.component.ts
    |-- feature.component.spec.ts
    |-- feature.model.ts
    |-- styles
        |-- index.ts
        |-- first.styles.ts
        |-- second.styles.ts
    |-- stories
        |-- first.stories.ts
        |-- second.stories.ts
```

## Barrel files

_Barrel_ files (`index.ts`) are used in each directory to export all the public code from the directory. Public code is all code that becomes part of published npm packages. Unit tests and storybook stories are not part of the public interface.

Another exception is the component definition file. The component definition file must _not_ be exported in the barrel as it conflicts with the lazy loading feature that is provided.

### Definition file

The component definition file (`[feature].def.ts`) that contains the component definition. The component definition is used to define the component selector and provide a reference to the implementation (Class).

### Component implementation

The main implementation is developed inside the component class (`[feature].component.ts`).

The implement can be further composed by other components, services, controllers or (shared) functions. Inheritance is not the composition pattern that we use, despite the fact that the Component itself will inherit from `LitElement`.

### Unit tests

Unit tests for the main component implementation are stored in `[feature].component.spec.ts`.

When the component is composed by other implementations, these implementations have their own test files. The main implementation will ideally mock the composed implementations to keep the test reliable.

### Styles

Component styles are implemented in a separate file `[feature].styles.ts` or, in case multiple files are used, in separate _styles_ directory. Styles inside the _styles_ directory are exported using a barrel file (`index.html`).

### Client model

Whenever a feature model is required, the TypeScript interfaces, types and enumerations are collected in a separate file (`[feature].model.ts`)

### Stories

Stories build for [storybook](https://storybook.js.org/) are moved inside a separate _stories_ directory.

## Unit testing guidelines

### Describe

Use `describe` for creating a block that groups together several related tests. For each scenario, we will write a `when` case that might have have one or multiple expected cases. When the scenario has alternative cases, it can be completed with `and`.

If a condition requires preconditions, a setup block is added in the `beforeEach` block. `beforeEach` is preferable for setting up of group tests, however, if there's only 1 small precondition it is fine to skip the `beforeEach` block.

Every code block inside `describe`, such as `beforeEach`, `it`, `afterEach`, should be separated by an empty line.

```ts
describe('when something happens', () => {
  beforeEach(() => {
    // setup preconditions
  });

  it('should expect a certain behaviour', () => {
    // test implementation
  ));

  describe('and another event/state is true', () => {
    beforeEach(() => {
      // setup preconditions
    });

    it('should expect another behaviour', () => {
      // test implementation
    ));
  });
});
```

### Component(s) initialization

Web components must be defined before they can be used in tests. The `utilities` package provides a the `useComponent` function to define one or multiple components. The `beforeAll` hook can be used to define a component for all test cases.

```ts
import { useComponent } from '@spryker-oryx/core/utilities';

describe('ComponentForTesting', () => {
  beforeAll(async () => {
    await useComponent(componentA);
    // or
    await useComponent([componentA, componentB]);
  });
});
```

### Dependency injection

Unit test must be setup with injected classes, functions or data. The `createInjector` is a convenient function that can be used to provide an implementation for an injection token.

The `createInjector` should be use in conjunction with the `destroyInjector`, so that the provided classes are _destroyed_ after the test is finished. The injected services can be referenced by the token using the `inject` method.

```ts
describe('ServiceToTest', () => {
  let serviceA: ServiceA;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ServiceAToken,
          useClass: ServiceA,
        },
        {
          provide: ServiceBToken,
          useClass: ServiceB,
        },
      ],
    });

    service = testInjector.inject(ServiceAToken);
  });

  afterEach(() => {
    destroyInjector();
  });
});
```

### Mocks

For mocking use native vitest api.
Service methods can be mocked via `vi.fn()`. We can get methods via DI and test mocked methods. Mocked methods _should not_ store any logic. Methods should be mocked with expected result by test case. Methods should be tested if it call with correct parameters (or just called, or called times which we needed) and/or pass data further to other methods. Don't forget to clean or reset your mocks in `afterEach` mocks.

<b>Wrong</b>

```ts
class MockServiceA {
  variable = null;

  methodA() {
    this.variable = 'a';
  }

  methodB() {
    this.variable = 'b';
  }

  getVariable() {
    return this.variable;
  }
}
```

<b>Correct</b>

```ts
class MockServiceA {
  methodA = vi.fn();
  methodB = vi.fn();
  getVariable = vi.fn();
}

describe('ServiceToTest', () => {
  let serviceA: ServiceA;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ServiceAToken,
          useClass: ServiceA,
        },
      ],
    });

    service = testInjector.inject(ServiceAToken);
  });

  afterEach(() => {
    vi.clearAllMocks();
    // or
    vi.resetAllMocks();
  });

  it('test case', () => {
    service.methodA.mockReturnValue('a');
    // or
    service.methodB.mockImplementation(() => 'b');
    // or
    service.getVariable.mockReturnValueOnce('c');
    service.getVariable.mockImplementationOnce((d) => d + 'c');

    service.methodA.toHaveBeenCalled();
    service.methodA.toHaveBeenCalledWith('data');
    service.methodA.toHaveBeenCalledTimes(3);
    // second call with proper parameter
    service.methodA.toHaveBeenNthCalledWith(2, 'data');
  });
});
```

For mocking not injected classes/methods/functions use `vi.spyOn`.

```ts

someFn() {
  return resolve('a')
}


import * as injector from '@spryker-oryx/injector';
import { resolve } from '@spryker-oryx/injector';

vi.spyOn(injector, 'resolve');

it('is resolve called', () => {
  injector.resolve.mockReturnValue('b');

  const result = someFn();
  expect(resolve).toHaveBeenCalledWith('a');
  expect(result).toBe('b');
});
```

### Best practices

- Use `toBe` for primitive comparison.
- Use `toEqual` for object/array.
- Not to use `toBeFalsy`, `toBeTruthy` at all (we can substitute them with `toBeNull`, `toBeDefined`, `toBe(0)`, `toBe(false/true)`.
- Use `textContent` together with `toContain` to check projected content instead of relying on the (unofficial) `innerText` API.
- Use `toHaveBeenCalledTogetherWith` when a call has arguments if not - use `toHaveBeenCalled` instead of `toHaveBeenCalledTimes` (`toHaveBeenCalledTimes` we can use in cases when we have to check exact number of calls).
- Test helpers, prototype extending should be located in the `@/tools/testing` storage.
- Use `toBeInTheDocument` `toContainElement` `toContainSlottedElement` for checking if component exist in the DOM.

  ```ts
  it(`should be in the DOM`, () => {
    expect(selector).toBeInTheDocument();
  });

  it('should contain element', () => {
    expect(element).toContainElement(selector);
  });

  it('should contain slotted element', () => {
    expect(element).toContainSlottedElement(selector);
  });
  ```

### Code coverage

We prefer to have high coverage. Satisfactory values should be around 80% and higher.

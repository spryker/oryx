## Unit testing guidelines

### Describe

Use `describe` for creating a block that groups together several related tests. For each scenario, we will write a `when` case, and the have one or many expected cases.
When a scenario is extended, it can be completed with `and`.
If the condition requires a setup block this is added in the `beforeEach` block.
Each `describe` block, `it` test case, `beforeEach, afterEach, beforeAll, afterAll` should have empty line in between.

```ts
describe('when something happens', () => {
  beforeEach(() => {
    // setup of group tests
  });
  it('should expect a certain behaviour', () => {
    // test implementation
  ));

  describe('and another event/state is true', () => {
    beforeEach(() => {
      // additional setup if needed
    });

    it('should expect a certain behaviour', () => {
      // test implementation
    ));
  })
})
```

### Component(s) initialization

For defining web component use `useComponent` from `@spryker-oryx/core/utilities` package which gets component definition or array of definitions as parameter. To define it for all tests call `useComponent` in `beforeAll` hook.

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

For creating injector and provides dependencies in it use `createInjector` from `@spryker-oryx/injector` which gets providers as parameter. Define it in `beforeEach` method. `createInjector` should be together with `destroyInjector` which should be called in `afterEach` hook. For using injected service you can get it from `createInjector` via `inject` method.

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
});
```

### Mocks

For mocking use native vitest api.
Service methods can be mocked via `vi.fn()`. We can get methods via DI and test mocked methods. Mocked methods _should not_ store any logic. Methods should be mocked with expected result by test case. Methods should be tested if it call with correct parameters (or just called, or called times which we needed) and/or pass data further to other methods.

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
- Test helpers, prototype extending should be located in the `@spryker-oryx/testing` storage.
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

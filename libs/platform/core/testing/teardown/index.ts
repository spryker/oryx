export type TeardownFn = () => void;

let disposables: TeardownFn[] = [];

/**
 * Allows to register teardown functions inside of any test case
 * which will be called after every test case without a global state.
 *
 * NOTE: After each test case all regostered teardown functions are removed.
 *
 * @example
 * ```ts
 * it('should trigger teardown logic' => {
 *   const someResource = allocate();
 *
 *   // This will get called after this test has completed
 *   addTeardown(() => someResource.dispose());
 *
 *   // Do some usual testing of someResource here...
 * })
 * ```
 *
 * Multiple teardown functions may be registered at once too:
 * @example
 * ```ts
 * addTeardown(terdownLogic1, terdownLogic2, ...terdownLogicN);
 * ```
 */
export function addTeardown(...fn: TeardownFn[]): void {
  disposables.push(...fn);
}

/**
 * Allows to manually trigger all registered teardown functions.
 *
 * NOTE: This is automatically called after each test case.
 */
export function teardownAll(): void {
  disposables.forEach((fn) => fn());
  disposables = [];
}

afterEach(teardownAll);

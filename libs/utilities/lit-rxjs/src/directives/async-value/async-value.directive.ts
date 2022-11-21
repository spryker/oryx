import { isPromise } from '@spryker-oryx/utilities';
import { isServer, noChange, TemplateResult } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, DirectiveResult, PartInfo } from 'lit/directive.js';
import { isObservable, Observable, Subscription } from 'rxjs';
import { AsyncValueObservableStrategy } from './async-value-observable-strategy';
import { AsyncValuePromiseStrategy } from './async-value-promise-strategy';
import { AsyncValueStrategy } from './types';

interface PartInfoRoot {
  options?: {
    host?: {
      shadowRoot?: Record<string, unknown>;
    };
  };
}

const asyncValueObservableInstance = new AsyncValueObservableStrategy();
const asyncValuePromiseInstance = new AsyncValuePromiseStrategy();

export class AsyncValueDirective extends AsyncDirective {
  object: Promise<unknown> | Observable<unknown> | null = null;
  strategy: AsyncValueStrategy | null = null;
  subscription: Subscription | Promise<unknown> | null = null;
  template?: (value: unknown) => TemplateResult;
  fallback?: () => TemplateResult;
  ssrRendered = false;

  content: Array<unknown> = [null];

  setValue(value: unknown): void {
    try {
      super.setValue(value);
      this.content = [];
    } catch (e) {
      this.content[0] = value;
    }
  }

  constructor(partInfo: PartInfo & PartInfoRoot) {
    super(partInfo);
    // In the case of SSR rendering, we'd like to not render the fallback, and the markup should just be hydrated.
    // The async directive does not directly have access to the component except through the constructor, so we do the check here.
    this.ssrRendered = !!partInfo.options?.host?.shadowRoot && !isServer;
  }

  render(
    object: Promise<unknown> | Observable<unknown> | null | undefined,
    template?: (value: unknown) => TemplateResult,
    fallback?: () => TemplateResult
  ): unknown {
    if (object && !this.object && this.isConnected) {
      this.subscribe(object, template, fallback);
    }

    if (object !== undefined && object !== this.object && this.isConnected) {
      this.dispose();
      this.render(object, template, fallback);
    }

    return isServer && this.content.length ? this.content : noChange;
  }

  async disconnected(): Promise<void> {
    await 0;
    if (!this.isConnected) {
      this.dispose();
    }
  }

  reconnected(): void {
    if (this.object) {
      this.subscribe(this.object, this.template, this.fallback);
    }
  }

  private subscribe(
    object: Promise<unknown> | Observable<unknown>,
    template?: (value: unknown) => TemplateResult,
    fallback?: () => TemplateResult
  ): void {
    if (fallback && !this.ssrRendered) {
      this.setValue(fallback());
    }

    this.object = object;
    this.template = template;
    this.fallback = fallback;
    this.strategy = this.select(object);

    this.subscription = this.strategy.createSubscription(object, (value) => {
      if (template) {
        this.setValue(template(value));

        return;
      }

      this.setValue(value);
    });
  }

  private dispose(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.strategy?.dispose(this.subscription!);
    this.object = null;
    this.strategy = null;
    this.subscription = null;
    this.template = undefined;
    this.fallback = undefined;
    this.setValue(null);
  }

  private select(
    object: Observable<unknown> | Promise<unknown>
  ): AsyncValueStrategy {
    if (isPromise(object)) {
      return asyncValuePromiseInstance;
    }

    if (isObservable(object)) {
      return asyncValueObservableInstance;
    }

    throw `Invalid AsyncValueDirective: ${object} for AsyncValueDirective`;
  }
}

/**
 * The asyncValue directive subscribes to an Observable or Promise and returns the latest value it has emitted.
 * When the component gets destroyed, the asyncValue directive unsubscribes automatically to avoid potential memory leaks.
 * When the reference of the expression changes, the asyncValue directive automatically unsubscribes from the old Observable or Promise and subscribes to the new one.
 * When second and third params defined asyncValue directive renders them as templates.
 *
 * Example
 * export class Component extends LitElement {
 *  prop$ = new BehaviorSubject('value');
 *
 *  render(): TemplateResult {
 *    return html`
 *      asyncValue(this.prop$)
 *      asyncValue(
 *        this.prop$,
 *        (value) => html`<div class="callback">${value}</div>`,
 *        () => html`<div class="fallback"></div>`
 *      )
 *    `;
 *  }
 * }
 */
export const asyncValue = directive(AsyncValueDirective) as <T>(
  object: Promise<T> | Observable<T> | null | undefined,
  template?: (value: T) => TemplateResult,
  fallback?: () => TemplateResult
) => DirectiveResult<typeof AsyncValueDirective>;

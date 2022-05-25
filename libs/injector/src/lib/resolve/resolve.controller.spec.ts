/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { fixture } from '@open-wc/testing-helpers';
import { getShadowElementBySelector } from '@spryker-oryx/testing';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createInjector, destroyInjector } from '../get-injector';
import { ResolveController } from './resolve.controller';

const mockAToken = 'mockAToken' as keyof InjectionTokensContractMap;
const mockAData = 'mockAData';
const mockBToken = 'mockBToken' as keyof InjectionTokensContractMap;
const mockBData = 'mockBData';
const mockCToken = 'mockCToken' as keyof InjectionTokensContractMap;
const mockDefaultData = 'mockDefaultData';
const mockOverrideData = 'mockOverrideData';

@customElement('parent-element')
class MockParentElement extends LitElement {
  protected controller = new ResolveController(this);

  addServiceA = this.controller.add(mockAToken);
  addServiceB = this.controller.add(mockBToken, mockDefaultData);
  addServiceC = this.controller.add(mockCToken, mockDefaultData);

  serviceA = this.controller.resolve<string>(mockAToken);
  serviceB = this.controller.resolve<string>(mockBToken);
  serviceC = this.controller.resolve<string>(mockCToken);

  protected override render(): TemplateResult {
    return html`
      <intermediate-element></intermediate-element>
      <child-element></child-element>
    `;
  }
}

@customElement('intermediate-element')
class MockIntermediateElement extends LitElement {
  protected override render(): TemplateResult {
    return html`<new-injector-element></new-injector-element> `;
  }
}

@customElement('child-element')
class MockChildElement extends LitElement {
  protected controller = new ResolveController(this);

  addServiceA = this.controller.add(mockAToken);

  get serviceA(): string {
    return this.controller.resolve<string>(mockAToken);
  }
}

@customElement('new-injector-element')
class MockNewInjectorElement extends LitElement {
  constructor() {
    super();

    createInjector({
      context: this,
      providers: [
        {
          provide: mockAToken,
          useValue: mockOverrideData,
        },
      ],
    });
  }
}

describe('ResolveController', () => {
  let element: MockParentElement;

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: mockAToken,
          useValue: mockAData,
        },
        {
          provide: mockBToken,
          useValue: mockBData,
        },
      ],
    });

    element = await fixture(html`<parent-element></parent-element> `);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should resolve token', () => {
    expect(element.serviceA).toBe(mockAData);
    expect(element.serviceB).toBe(mockBData);
  });

  it('should resolve token with default value', () => {
    expect(element.serviceB).toBe(mockBData);
    expect(element.serviceC).toBe(mockDefaultData);
  });

  it('should update resolved value on hostConnected if provided value has been changed', () => {
    const child = getShadowElementBySelector(
      element,
      'child-element'
    )! as MockChildElement;
    const intermediate = getShadowElementBySelector(
      element,
      'intermediate-element'
    )! as MockIntermediateElement;
    const newInjector = getShadowElementBySelector(
      intermediate,
      'new-injector-element'
    )! as MockIntermediateElement;

    expect(child.serviceA).toBe(mockAData);

    newInjector.shadowRoot!.appendChild(child);

    expect(child.serviceA).toBe(mockOverrideData);
  });
});

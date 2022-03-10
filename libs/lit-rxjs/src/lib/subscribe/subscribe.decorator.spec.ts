// import { expect, fixture } from '@open-wc/testing';
// import { html, LitElement } from 'lit';
// import { customElement, property } from 'lit/decorators.js';
// import { finalize, interval, tap } from 'rxjs';
// import { spy } from 'sinon';
// import { subscribe } from './subscribe.decorator';

// const tick = 50;
// const delay = (ms: number): Promise<unknown> =>
//   new Promise((res) => setTimeout(res, ms));

// @customElement('mock-component')
// class MockComponent extends LitElement {
//   mockCallback = spy();
//   mockAnotherCallback = spy();
//   mockDisconnectedCallback = spy();
//   mockDisconnectedAnotherCallback = spy();

//   @subscribe()
//   mock$ = interval(tick).pipe(
//     tap(this.mockCallback),
//     finalize(this.mockDisconnectedCallback)
//   );

//   @subscribe()
//   mockAnother$ = interval(tick).pipe(
//     tap(this.mockAnotherCallback),
//     finalize(this.mockDisconnectedAnotherCallback)
//   );

//   @property()
//   test = 'new';

//   disconnectedCallback(): void {
//     super.disconnectedCallback();
//   }
// }

// describe('subscribe decorator', () => {
//   let element: MockComponent;

//   beforeEach(async () => {
//     element = await fixture(html`<mock-component></mock-component>`);
//   });

//   it('should unsubscribe from observable on disconnectedCallback hook', () => {
//     element.disconnectedCallback();

//     expect(element.mockDisconnectedCallback).calledWith();
//     expect(element.mockDisconnectedAnotherCallback).calledWith();
//   });

//   it('should subscribe to observable on connectedCallback hook', async () => {
//     await delay(tick + 10);

//     expect(element.mockCallback).calledWith();
//     expect(element.mockAnotherCallback).calledWith();
//   });

//   it('should throw an error if initial value is not observable', async () => {
//     @customElement('mock-error-component')
//     class MockErrorComponent extends LitElement {
//       @subscribe()
//       mock = 'notObservable';
//     }

//     try {
//       new MockErrorComponent();
//       expect(false).to.be.true;
//     } catch (e) {
//       expect(true).to.be.true;
//     }
//   });
// });

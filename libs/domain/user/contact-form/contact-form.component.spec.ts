import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FormRenderer } from 'libs/platform/form/src';
import { html } from 'lit';
import { userContactFormComponent } from './contact-form.def';
import { fields } from './contact-form.model';

class MockFormRenderer implements Partial<FormRenderer> {
  buildForm = vi.fn().mockReturnValue(html``);
}

describe('UserContactFormComponent', () => {
  let renderer: MockFormRenderer;

  beforeAll(async () => {
    await useComponent(userContactFormComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: FormRenderer,
          useClass: MockFormRenderer,
        },
      ],
    });
    renderer = testInjector.inject(FormRenderer) as unknown as MockFormRenderer;

    await fixture(html`<user-contact-form></user-contact-form>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('should build a form', () => {
    expect(renderer.buildForm).toHaveBeenCalledWith(fields);
  });
});

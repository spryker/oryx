import { mockLitHtml } from '@/tools/testing';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { ComponentMapping } from '../experience-tokens';
import { ComponentsRegistryService } from './components-registry.service';
import { DefaultComponentsRegistryService } from './default-components-registry.service';

vi.mock('lit', async () => ({
  ...((await vi.importActual('lit')) as Array<unknown>),
  html: mockLitHtml,
}));

vi.mock('lit/directives/unsafe-html.js', async () => ({
  ...((await vi.importActual(
    'lit/directives/unsafe-html.js'
  )) as Array<unknown>),
  unsafeHTML: (value: TemplateStringsArray) => value,
}));

const mockMapper = {
  typeA: {
    tag: 'custom-tag-A',
  },
  typeB: {
    template: vi.fn(),
  },
  typeC: {},
};

describe('DefaultComponentsRegistryService', () => {
  let service: DefaultComponentsRegistryService;

  beforeEach(() => {
    vi.clearAllMocks();
    createInjector({
      providers: [
        {
          provide: ComponentsRegistryService,
          useClass: DefaultComponentsRegistryService,
        },
        {
          provide: ComponentMapping,
          useValue: mockMapper,
        },
      ],
    });
    service = getInjector().inject(ComponentsRegistryService);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('resolveTag', () => {
    it('should return tag', () => {
      expect(service.resolveTag('typeA')).toBe(mockMapper.typeA.tag);
    });

    it('should return property as tag if it is not existed in the mapper', () => {
      expect(service.resolveTag('typeB')).toBe('typeB');
    });
  });

  describe('resolveTemplate', () => {
    it('should return template', () => {
      mockMapper.typeB.template.mockReturnValue('templateB');
      const template = service.resolveTemplate({
        type: 'typeB',
        uid: 'uidB',
        markers: 'styleClassB',
      });
      expect(mockMapper.typeB.template).toHaveBeenCalledWith(
        'uidB',
        'styleClassB'
      );
      expect(template).toBe('templateB');
    });

    it('should return generated template if it is not existed in the mapper', () => {
      const template = service.resolveTemplate({
        type: 'typeA',
        uid: 'uidA',
        markers: 'styleClassA',
      });
      expect(template).toBe(
        '<custom-tag-A uid=uidA styleClassA></custom-tag-A>'
      );
    });

    it('should generate tag and return generated template if it is not existed in the mapper', () => {
      const template = service.resolveTemplate({
        type: 'typeC',
        uid: 'uidA',
        markers: 'styleClassA',
      });
      expect(template).toBe('<typeC uid=uidA styleClassA></typeC>');
    });
  });
});

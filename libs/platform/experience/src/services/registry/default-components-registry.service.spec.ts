import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { ComponentMapping } from '../experience-tokens';
import { ComponentsRegistryService } from './components-registry.service';
import { DefaultComponentsRegistryService } from './default-components-registry.service';

vi.mock('lit/static-html.js', async () => ({
  ...((await vi.importActual('lit/static-html.js')) as Array<unknown>),
  html: (svg: string[], ...values: string[]): string => {
    const template = [svg[0]];

    for (let i = 0; i < values.length; i++) {
      template.push(values[i]);
      template.push(svg[i + 1]);
    }

    return template.join('');
  },
  unsafeStatic: (value: TemplateStringsArray) => value,
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
      const template = service.resolveTemplate('typeB', 'uidB', 'styleClassB');
      expect(mockMapper.typeB.template).toHaveBeenCalledWith(
        'uidB',
        'styleClassB'
      );
      expect(template).toBe('templateB');
    });

    it('should return generated template if it is not existed in the mapper', () => {
      const template = service.resolveTemplate('typeA', 'uidA', 'styleClassA');
      expect(template).toBe(
        '<custom-tag-A uid=uidA class=styleClassA></custom-tag-A>'
      );
    });

    it('should generate tag and return generated template if it is not existed in the mapper', () => {
      const template = service.resolveTemplate('typeC', 'uidA', 'styleClassA');
      expect(template).toBe('<typeC uid=uidA class=styleClassA></typeC>');
    });
  });
});

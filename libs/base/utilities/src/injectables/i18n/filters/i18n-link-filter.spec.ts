import {
  LinkI18nContextFilter,
  LinkI18nContextFilterConfig,
} from './i18n-link-filter';

describe('LinkI18nContextFilter', () => {
  let filter: LinkI18nContextFilter;

  beforeEach(() => {
    filter = new LinkI18nContextFilter();
  });

  describe('getName() method', () => {
    it('should return name `link`', () => {
      expect(filter.getName()).toEqual('link');
    });
  });

  describe('producesHtml() method', () => {
    it('should return true', () => {
      expect(filter.producesHtml()).toBe(true);
    });
  });

  describe('process() method', () => {
    it('should produce a link from href', () => {
      const config: LinkI18nContextFilterConfig = {
        href: 'https://example.com',
      };
      const value = 'Example Link';
      const expectedOutput = `<a href="${config.href}">${value}</a>`;

      expect(filter.process(value, config)).toEqual(expectedOutput);
    });

    it('should produce a link from href and target', () => {
      const config: LinkI18nContextFilterConfig = {
        href: 'https://example.com',
        target: '_blank',
      };
      const value = 'Example Link';
      const expectedOutput = `<a href="${config.href}" target="${config.target}">${value}</a>`;

      expect(filter.process(value, config)).toEqual(expectedOutput);
    });
  });
});

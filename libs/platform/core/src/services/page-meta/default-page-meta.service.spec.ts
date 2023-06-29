import { nextFrame } from '@open-wc/testing-helpers';
import { DefaultPageMetaService } from './default-page-meta.service';

describe('DefaultPageMetaService', () => {
  const service = new DefaultPageMetaService();

  beforeEach(() => {
    document.head.innerHTML = '';
  });

  describe('add', () => {
    it('should add proper tag to the head of document', () => {
      service.add([
        {
          name: 'title',
          attrs: {
            text: 'Composable Storefront',
          },
        },
        {
          name: 'style',
          attrs: {
            text: 'style B',
          },
        },
      ]);
      const title = document.head.querySelector('title');
      const style = document.head.querySelector('style');
      expect(title?.textContent).toContain('Composable Storefront');
      expect(style?.textContent).toContain('style B');
    });

    it('should add meta tag to the head of document', () => {
      service.add([
        {
          name: 'og:img',
          attrs: {
            content: 'a',
          },
        },
        {
          name: 'meta',
          attrs: {
            charset: 'b',
            content: 'b',
          },
        },
      ]);
      const imgMeta = document.head.querySelector('meta[name="og:img"]');
      const charsetMeta = document.head.querySelector('meta[charset="b"]');
      expect(imgMeta).toBeDefined();
      expect(imgMeta).toHaveProperty('content', 'a');
      expect(charsetMeta).toBeDefined();
      expect(charsetMeta).toHaveProperty('content', 'b');
    });

    it('should escape quote symbol', () => {
      service.add([
        {
          name: 'og:img',
          attrs: {
            content: `a"'–<>—`,
          },
        },
      ]);
      const imgMeta = document.head.querySelector('meta[name="og:img"]');
      expect(imgMeta).toHaveProperty(
        'content',
        'a&quot;&apos;&ndash;&lt;&gt;&mdash;'
      );
    });

    it('should add attributes to the html tag', () => {
      service.add({
        name: 'html',
        attrs: {
          lang: 'en',
        },
      });

      expect(document.documentElement).toHaveProperty('lang', 'en');
    });
  });

  describe('remove', () => {
    it('should remove proper tag from head of document', async () => {
      service.add([
        {
          name: 'title',
          attrs: {
            text: 'Composable Storefront',
          },
        },
      ]);
      let title = document.head.querySelector('title');
      expect(title).not.toBeNull();
      service.remove([
        {
          name: 'title',
          attrs: {
            text: 'Composable Storefront',
          },
        },
      ]);
      title = document.head.querySelector('title');
      await nextFrame();
      expect(title).toBeNull();
    });
  });

  describe('setHtmlAttributes', () => {
    it('should add attributes to the html tag', () => {
      service.setHtmlAttributes({
        lang: 'de',
      });

      expect(document.documentElement).toHaveProperty('lang', 'de');
    });
  });

  describe('update', () => {
    it('should create element if its not existed', () => {
      service.update({
        name: 'meta',
        attrs: {
          content: 'a',
        },
      });
      const content = document.head.querySelector('meta');
      expect(content).toHaveProperty('content', 'a');

      service.update({
        name: 'meta',
        attrs: {
          content: 'b',
        },
      });
      expect(content).toHaveProperty('content', 'b');
    });
  });
});

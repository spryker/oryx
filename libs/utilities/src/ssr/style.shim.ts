import { Type } from '@spryker-oryx/injector';
import { toCSS, toJSON } from 'css-convert-json';
import { LitElement } from 'lit';

export const ssrStyleShim = (litClass: Type<LitElement>): void => {
  litClass.prototype.toggleAttribute = function (
    property: string,
    force?: boolean
  ): boolean {
    if (force === undefined ? this.hasAttribute(property) : !force) {
      this.removeAttribute(property);
      return false;
    }
    this.setAttribute(property, '');
    return true;
  };

  Object.defineProperty(litClass.prototype, '_styles', {
    value: {},
    writable: true,
  });

  Object.defineProperty(litClass.prototype, 'style', {
    get() {
      return {
        ...this._styles,
        ...this._customStyles,
        setProperty: function (this: any, property: string, value: string) {
          if (!this._customStyles) {
            this._customStyles = toJSON(this.getAttribute('style')).attributes;
          }
          this._styles[property] = value;
          this.setAttribute(
            'style',
            toCSS({
              children: {},
              attributes: { ...this._styles, ...this._customStyles },
            }) ?? ''
          );
        }.bind(this),
      };
    },
    set(value: string) {
      this._customStyles = toJSON(value).attributes;
    },
  });
};

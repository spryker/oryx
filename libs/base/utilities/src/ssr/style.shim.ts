import { toCSS, toJSON } from 'css-convert-json';
import { LitElement } from 'lit';
import { Type } from '../misc';

//all properties and methods re-defining should be conditional
//due to testing environment is also a server environment

export const ssrStyleShim = (litClass: Type<LitElement>): void => {
  if (!Reflect.has(litClass.prototype, 'toggleAttribute')) {
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
  }

  if (!Reflect.has(litClass.prototype, 'style')) {
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
              this._customStyles = toJSON(
                this.getAttribute('style')
              ).attributes;
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
  }
};

import { toCSS, toJSON } from 'css-convert-json';
import { LitElement } from 'lit';
import { Type } from '../misc';

const stylesProp = Symbol('stylesProperty');
const customStylesProp = Symbol('customStylesProperty');

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
    Object.defineProperty(litClass.prototype, 'style', {
      get() {
        if (!this[stylesProp]) {
          this[stylesProp] = {};
        }
        if (!this[customStylesProp]) {
          this[customStylesProp] = toJSON(
            this.getAttribute('style')
          ).attributes;
        }

        return {
          ...this[stylesProp],
          ...this[customStylesProp],
          setProperty: function (this: any, property: string, value: string) {
            this[stylesProp][property] = value;
            this.setAttribute(
              'style',
              toCSS({
                children: {},
                attributes: { ...this[stylesProp], ...this[customStylesProp] },
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

# Boolean attributes

HTML has [built-in boolean attributes](https://meiert.com/en/blog/boolean-attributes-of-html) that are treated differently from the attributes that have a name and value. The built-in attributes only indicate if the attribute is set or not - the value is ignored and should be one of the following:

- Not set: `<input disabled>`
- Empty string: `<input disabled="">`
- Case insensitive string that equals to the attribute name: `<input disabled="disabled">`

For more details about the attributes, see [2.3.2 Boolean attributes](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes).

## Lit components

When a boolean attribute is needed, a property MUST be [decorated](https://lit.dev/docs/components/properties/#attributes) and:

- MUST have a `type` set to `Boolean` so that a conversion to/from attribute/prop is correctly handled.
- MAY have a `reflect` enabled so that it's correctly reflected in the DOM.

## Custom Elements

When working with boolean attributes it is important to set it as the HTML spec requires
(see the beginning of this article).

There is a handy [DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute)
specifically designed for a boolean attributes `Element.toggleAttribute('attr-name')`:

```ts
const elem = document.querySelector('div');

// Set when not set or unset when already set
elem.toggleAttribute('attr-name'); // => <div attr-name></div> or <div></div>

// Force to be set
elem.toggleAttribute('attr-name', true); // => <div attr-name></div>

// Force to be unset
elem.toggleAttribute('attr-name', false); // => <div></div>
```

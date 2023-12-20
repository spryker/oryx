"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svg = exports.when = exports.property = exports.css = exports.html = exports.TemplateResult = exports.directive = exports.Directive = exports.AsyncDirective = exports.LitElement = void 0;
globalThis.window = {};
globalThis.document = {
    createTreeWalker: () => { },
};
globalThis.HTMLElement = class {
};
globalThis.customElements = {
    get: () => { },
    define: () => { },
};
class LitElement {
}
exports.LitElement = LitElement;
class AsyncDirective {
}
exports.AsyncDirective = AsyncDirective;
class Directive {
}
exports.Directive = Directive;
function directive() { }
exports.directive = directive;
exports.TemplateResult = '';
const html = () => '';
exports.html = html;
const css = () => '';
exports.css = css;
const property = () => '';
exports.property = property;
const when = () => '';
exports.when = when;
const svg = (svg, ...values) => {
    const template = [svg[0]];
    for (let i = 0; i < values.length; i++) {
        template.push(...values[i]);
        template.push(svg[i + 1]);
    }
    return template;
};
exports.svg = svg;
//# sourceMappingURL=mock-svg-lit.js.map
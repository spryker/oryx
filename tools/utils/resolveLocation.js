"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveLocationOf = exports.TypeLocationMap = void 0;
exports.TypeLocationMap = {
    app: 'apps',
    lib: 'libs',
    e2e: 'apps',
};
const resolveLocationOf = (project, nodes) => exports.TypeLocationMap[nodes[project].type];
exports.resolveLocationOf = resolveLocationOf;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyDependencies = void 0;
const resolveLocation_1 = require("./resolveLocation");
const stringifyDependencies = (dependencies, nodes) => dependencies
    .reduce((acc, item) => `${acc} ${(0, resolveLocation_1.resolveLocationOf)(item, nodes)}/${item}/*`, '')
    .trim();
exports.stringifyDependencies = stringifyDependencies;

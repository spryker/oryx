"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDependencies = void 0;
const filterOutExternalDependencies = (dependencies) => dependencies
    .filter((dep) => dep.target.match('^((?!npm:).)*$'))
    .map((dep) => dep.target);
const findDependencies = (dependencies, project) => {
    const deps = filterOutExternalDependencies(dependencies[project]);
    return [
        ...new Set([
            project,
            ...deps.reduce((acc, dep) => [...acc, ...(0, exports.findDependencies)(dependencies, dep)], []),
        ]),
    ];
};
exports.findDependencies = findDependencies;

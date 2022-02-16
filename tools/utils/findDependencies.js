"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDependencies = void 0;
const findDependencies = (dependencies, project) => {
    const deps = dependencies[project]
        .filter((dep) => dep.target.match('^((?!npm:).)*$'))
        .map((dep) => dep.target);
    if (deps.length > 0) {
        return [
            project,
            ...deps.reduce((acc, dep) => [...acc, ...(0, exports.findDependencies)(dependencies, dep)], []),
        ];
    }
    return [project];
};
exports.findDependencies = findDependencies;

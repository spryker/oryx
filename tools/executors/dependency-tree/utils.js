"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDependencies = void 0;
const findDependencies = (dependencies, project) => {
    // filter out external dependencies
    const deps = dependencies[project]
        .filter((dep) => dep.target.match('^((?!npm:).)*$'))
        .map((dep) => dep.target);
    return [
        ...new Set([
            project,
            ...deps.reduce((acc, dep) => [...acc, ...findDependencies(dependencies, dep)], []),
        ]),
    ];
};
const stringifyDependencies = (dependencies, nodes) => dependencies
    .map((item) => `${nodes[item].data.root}/*`)
    .sort()
    .reduce((acc, item) => `${acc} ${item}`, '')
    .trim();
const getDependencies = (graph, project) => stringifyDependencies(findDependencies(graph.dependencies, project), graph.nodes);
exports.getDependencies = getDependencies;

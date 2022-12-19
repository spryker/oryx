"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDependencies = void 0;
const TypeLocationMap = {
    app: 'apps',
    lib: 'libs',
    e2e: 'apps',
};
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
    .map((item) => `${TypeLocationMap[nodes[item].type]}/${item}/*`)
    .sort()
    .reduce((acc, item) => `${acc} ${item}`, '')
    .trim();
const getDependencies = (graph, project) => stringifyDependencies(findDependencies(graph.dependencies, project), graph.nodes);
exports.getDependencies = getDependencies;

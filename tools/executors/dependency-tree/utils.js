"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDependencies = void 0;
const findDependencies = (dependencies, project) => {
    const foundDependencies = { [project]: true };
    const iterable = dependencies[project];
    for (const dep of iterable) {
        const isExist = foundDependencies[dep.target];
        const isNpm = dep.target.match('^npm:.*$');
        const isSprykerOryx = dep.target === 'spryker-oryx';
        if (isNpm || isExist || isSprykerOryx) {
            continue;
        }
        foundDependencies[dep.target] = true;
        iterable.push(...dependencies[dep.target]);
    }
    return Object.keys(foundDependencies);
};
const stringifyDependencies = (dependencies, nodes) => dependencies
    .map((item) => `${nodes[item].data.root}/*`)
    .sort()
    .reduce((acc, item) => `${acc} ${item}`, '')
    .trim();
const getDependencies = (graph, project) => stringifyDependencies(findDependencies(graph.dependencies, project), graph.nodes);
exports.getDependencies = getDependencies;

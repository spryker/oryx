"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDependencies = void 0;
const findDependencies = (dependencies, project) => {
    const temp = [project];
    for (const p of temp) {
        const deps = dependencies[p]
            .filter((dep) => dep.target.match('^((?!npm:).)*$'))
            .filter((dep) => !temp.includes(dep.target))
            .filter((dep) => dep.target !== 'spryker-oryx')
            .map((dep) => dep.target);
        temp.push(...deps);
    }
    return temp;
};
const stringifyDependencies = (dependencies, nodes) => dependencies
    .map((item) => `${nodes[item].data.root}/*`)
    .sort()
    .reduce((acc, item) => `${acc} ${item}`, '')
    .trim();
const getDependencies = (graph, project) => stringifyDependencies(findDependencies(graph.dependencies, project), graph.nodes);
exports.getDependencies = getDependencies;

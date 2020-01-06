const { fetchDependencies } = require('../helpers/index');
const cache = require('../lib/cache');
const Package = require('../lib/package');

/**
 * Recursively fetches all dependencies of a package
 */
async function getAllDependenciesTree(pack, results = {}) {
    // If cache already has the package dependencies
    if (cache.has(pack.key)) {
        // Take it to not to make requests for already cached packages
        results[pack.key] = cache.get(pack.key);
        return;
    }

    const childs = {};
    results[pack.key] = childs;
    const dependencies = await fetchDependencies(pack.url);
    if (dependencies) {
        const promises = [];
        // For each dependency
        for (const [name, version] of Object.entries(dependencies)) {
            const pack = new Package(name, version);
            // Fetch its own dependencies
            promises.push(getAllDependenciesTree(pack, childs));
        }

        await Promise.all(promises);
    }

    return results;
}

const npmApi = {
    getAllDependenciesTree
};

module.exports = npmApi;
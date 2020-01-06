/**
 * A caching module.
 * Recursively stores each package key (e.g. express@latest) in a HashMap<key, dependencies>.
 * Each dependency references to another key in the HashMap or to an empty object.
 */
function getCache() {
    // The mapping stores package key => childs where if a child has its own childs it refers to them in the same parent2childs object
    const parent2childs = {};

    // Stores each package with its direct dependencies to the parent2childs so that if a parent's child has its own
    // dependencies the child just refers to them in the parent2childs mapping
    const set = (tree, parent = null) => {
        if (!parent) {
            parent = parent2childs;
        }

        for (const [key, childs] of Object.entries(tree)) {
            if (!parent2childs[key]) {
                parent2childs[key] = {};

                parent[key] = parent2childs[key];

                set(childs, parent2childs[key]);
            } else {
                parent[key] = parent2childs[key];
            }
        }
    };

    // Get all package dependencies by key
    const get = key => parent2childs[key] ? parent2childs[key] : null;

    // Check if a package has been already cached
    const has = key => !!parent2childs[key];

    return {
        set,
        get,
        has,
    };
}

const cache = getCache();

module.exports = cache;
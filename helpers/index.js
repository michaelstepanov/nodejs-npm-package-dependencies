const fetch = require('node-fetch');
const logger = require('../config/winston');

/**
 * Fetches dependencies by package's url
 */
async function fetchDependencies(url)
{
    const res = await fetch(url);
    const json = await res.json();

    if (res.status >= 400 && res.status < 600) {
        // Log once the main stack is clear
        setImmediate(() => {
            logger.error('Bad response from server', {url, json});
        });
    }

    return json.dependencies;
}

exports.fetchDependencies = fetchDependencies;
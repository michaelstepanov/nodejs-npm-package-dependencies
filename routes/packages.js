const express = require('express');
const router = express.Router();
const cache = require('../lib/cache');
const npmApi = require('../apis/npm-api');
const Package = require('../lib/package');
const validateNpmPackageName = require('validate-npm-package-name');
const _ = require('lodash');
const semver = require('semver');
const logger = require('../config/winston');

router.get('/:name/:version/dependencies/all', async (req, res) => {
    try {
        // Validate input
        validate(req, res);

        const name = req.params.name;
        const version = req.params.version;

        const pack = new Package(name, version);

        let dependencies;

        try {
            logger.info('Getting data from cache...');

            // Check data in cache
            dependencies = cache.get(pack.key);
            if (dependencies !== null) {
                // Return if exists
                return res.status(304).json({[pack.key]: dependencies});
            }
        } catch (e) {
            logger.error('Getting data from cache caused an error', e);
        }

        try {
            // TODO If the package exists in DB
                // TODO Get data from DB
                // TODO Cache the data
                // TODO Return the data
        } catch (e) {
            logger.error('Getting data from cache caused an error', e);
        }

        // Get all package dependencies from API
        dependencies = await npmApi.getAllDependenciesTree(pack);

        // Log once the main stack is clear
        setImmediate(() => {
            try {
                logger.info('Storing dependencies to cache...');
                // Add tree to the cache
                cache.set(dependencies);
            } catch (e) {
                logger.error('Storing to cache caused an error', e);
            }
        });

        // Log once the main stack is clear
        setImmediate(() => {
            try {
                logger.info('Storing dependencies to DB...');

                // TODO Add dependencies to the DB

                // TODO DB could have the structure below (table_name: column_1, column_2, ...):
                // TODO packages: id | name | created_at | updated_at
                // TODO package_versions: id | package_id | version | created_at | updated_at
                // TODO package_dependencies: id | package_version_id | dependency_package_version_id | created_at | updated_at
            } catch (e) {
                logger.error('Storing to DB caused an error', e);
            }
        });

        return res.status(200).json(dependencies);
    } catch (e) {
        logger.error('An error occurred', e);

        res.status(500).json({
            message: 'An error occurred',
        });
    }

    function validate(req, res) {
        const name = req.params.name;
        const version = req.params.version;

        const errors = {};
        // Validate input name
        const validName = validateNpmPackageName(name);
        if (!validName.validForNewPackages && !validName.validForOldPackages) {
            errors.name = validName.errors;
        }

        // Valid versions in addition to numerical versions that are checked after
        const validVersions = new Set(['latest']);
        if (_.isEmpty(errors) && validVersions.has(version)) {
            return;
        }

        const validVersion = semver.valid(version);
        if (!validVersion) {
            errors.version = ['Version is not valid'];
        }

        if (!_.isEmpty(errors)) {
            res.status(422).json({
                message: 'Input is invalid',
                errors,
            });
            res.end();
        }
    }
});

module.exports = router;
const { fetchDependencies } = require('../helpers/index');
const fetch = require('node-fetch');

beforeEach(() => {
    fetch.resetMocks();
});

afterEach(() => {
    jest.resetModules()
});

describe('fetchDependencies', () => {
    it('should fetch dependencies', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            "dependencies": {
                "app-root-path": "^3.0.0",
                "body-parser": "^1.19.0",
            },
        }));

        const dependencies = await fetchDependencies();
        expect(dependencies).toEqual({
            "app-root-path": "^3.0.0",
            "body-parser": "^1.19.0",
        });
    });
});

describe('cache', () => {
    it('should save one dimensional object', () => {
        const cache = require('../lib/cache');
        cache.set({
            'key': {}
        });
        expect(cache.get('key')).toEqual({});
    });

    it('should get nested objects', () => {
        const cache = require('../lib/cache');
        const tree = {
            '1': {
                '2': {
                    '4': {}
                },
                '3': {}
            }
        };
        cache.set(tree);
        expect(cache.get('1')).toEqual({
            '2': {
                '4': {}
            },
            '3': {}
        });
    });

    it('should get empty object', () => {
        const cache = require('../lib/cache');
        const tree = {
            '1': {
                '2': {
                    '4': {}
                },
                '3': {}
            }
        };
        cache.set(tree);
        expect(cache.get('4')).toEqual({});
    });

    it('should get null', () => {
        const cache = require('../lib/cache');
        expect(cache.get('4')).toEqual(null);
    });

    it('should not has a key', () => {
        const cache = require('../lib/cache');
        expect(cache.has('key')).toBe(false);
    });

    it('should has a key', () => {
        const cache = require('../lib/cache');
        cache.set({'key': {}});
        expect(cache.has('key')).toBe(true);
    });

    it('should has nested key', () => {
        const cache = require('../lib/cache');
        cache.set({
            'key': {
                'subkey': {
                    'subsubkey': {}
                }
            }
        });
        expect(cache.has('subsubkey')).toBe(true);
    });
});

// TODO Cover rest of the code
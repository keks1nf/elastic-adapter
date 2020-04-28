'use strict';

const NodeCache = require( "node-cache" );
const md5 = require('md5');

const cache = new NodeCache({ stdTTL: 60, checkperiod: 60, maxKeys: 1000 })

module.exports = function ClientCacheDecorator (client) {
    this.client = client;

    const search = async ({ bodyQuery, bodySource }) => {
        const hash = md5(JSON.stringify({ bodyQuery, bodySource, action: 'search' }));

        if (cache.has(hash)) {
            return await cache.get(hash);
        }

        const response = await this.client.search({ bodyQuery, bodySource });
        cache.set(hash, response, 60);

        return response;
    }

    const count = async ({ bodyQuery }) => {
        const hash = md5(JSON.stringify({ bodyQuery, action: 'count' }));

        if (cache.has(hash)) {
            return await cache.get(hash);
        }

        const response = await this.client.count({ bodyQuery });
        cache.set(hash, response, 60);

        return response;
    }

    return {
        search,
        count,
        query: this.client.query
    };
}

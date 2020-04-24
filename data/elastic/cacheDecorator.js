const NodeCache = require( "node-cache" );
const md5 = require('md5');

const cache = new NodeCache({ stdTTL: 60, checkperiod: 60, maxKeys: 1000 })

const ClientCacheDecorator = function ClientCacheDecorator (client) {
    this.client = client

    const search = async ({ bodyQuery, bodySource }) => {
        const hash = md5(JSON.stringify({ bodyQuery, bodySource }))

        if (cache.has(hash)) {
            console.log(`hash get ${hash}`)
            return await cache.get(hash)
        }

        const response = await this.client.search({ bodyQuery, bodySource });
        cache.set(hash, response, 60)
        console.log(`hash set ${hash}`)

        return response;
    }

    return {
        search,
        query: this.client.query
    }
}

module.exports.ClientCacheDecorator = ClientCacheDecorator

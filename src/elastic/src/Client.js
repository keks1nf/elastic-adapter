'use strict';

const elasticsearch = require('elasticsearch');
const Adapter = require('./Adapter')

module.exports = function Client (server, port, version, cache) {
    this.server = server
    this.port = port;
    this.version = version;

    this.cache = cache

    const getClient = () => {
        return new elasticsearch.Client({
          host: `${this.server}:${this.port}`,
          // log: 'trace',
          apiVersion: this.version.toString(), // use the same version of your Elasticsearch instance
        });
    }

    const adapter = new Adapter();
    const client = getClient();

    const search = async ({ bodyQuery, bodySource }) => {
        const query = {
            bool: {
                filter: adapter.adaptFilters(bodyQuery)
            }
        }

        return await client.search({
          index: 'user_search*',
          type: '_doc',
          body: {
              query,
              _source: bodySource
          }
        })
    }

    return {
        search,
        query: adapter.adaptFilters
    }
}

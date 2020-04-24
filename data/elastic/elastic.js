'use strict';

var elasticsearch = require('elasticsearch');

const Adapter = function Adapter () {
    const adaptFilters = (query) => {
        const filters = []

        for (let item in query) {
            const params = query[item];

            if (typeof params == 'string' || typeof params == 'numeric') {
                filters.push({
                    term: {
                        [item]: params
                    }
                })
            } else if (Array.isArray(params)) {
                filters.push({
                    terms: {
                        [item]: params
                    }
                })
            } else if (typeof params == 'object') {
                if (params && (params.from || params.to)) {
                    let range = {[item]: {}}

                    if (params.from) {
                        range[item]['gte'] = params.from
                    }

                    if (params.to) {
                        range[item]['lte'] = params.to
                    }

                    filters.push({ range })
                }

            }
        }

        return filters;
    }

    return {
        adaptFilters
    }
}

const Client = function Client (server, port, version, cache) {
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

const Presentor = function Presentor () {
    const hits = (response) => {
        if (response.hits && response.hits.hits) {
            return response.hits.hits.map(hit => hit._source);
        } else {
            return [];
        }
    }

    return {
        hits
    };
}

module.exports.Adapter = Adapter
module.exports.Client = Client
module.exports.Presentor = Presentor

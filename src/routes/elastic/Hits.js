'use strict'
const { Client, Presentor, ClientCacheDecorator } = require('../../elastic/elastic')
const { host, port, version } = require('../../constants/elastic.js')

module.exports = function Hits() {
    const client = new ClientCacheDecorator(new Client(host, port, version))

    const post = async (req, res) => {
        const bodyQuery = req.body && req.body.query
        const bodySource = req.body && req.body.source
        const response = await client.search({ bodyQuery, bodySource })

        const hits = new Presentor().hits(response);

        if (!hits.length) {
            res.send({
                error: 'Empty result',
                data: hits,
                query: client.query({ bodyQuery, bodySource })
            })
        } else {
            res.send({
                error: null,
                data: hits,
                query: client.query({ bodyQuery, bodySource })
            })
        }
    }

    return {
        post
    };
}

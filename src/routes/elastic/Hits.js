'use strict'
const { Presentor, ClientsRegister, Adapter } = require('../../elastic/elastic')
// const { host, port, version } = require('../../constants/elastic.js')
// const md5 = require('md5');

module.exports = function Hits() {
    const register = ClientsRegister();
    const adapter = new Adapter();

    const post = async (req, res) => {
        const bodyQuery = req.body && req.body.query
        const bodySource = req.body && req.body.source
        const serverParams = req.body && req.body.serverParams

        const response = await register(serverParams).search({ bodyQuery, bodySource })
        const hits = new Presentor().hits(response);

        if (!hits.length) {
            res.send({
                error: 'Empty result',
                data: hits,
                query: adapter.adaptFilters(bodyQuery)
            })
        } else {
            res.send({
                error: null,
                data: hits,
                query: adapter.adaptFilters(bodyQuery)
            })
        }
    }

    return {
        post
    };
}

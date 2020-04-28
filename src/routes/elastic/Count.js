'use strict'

const { ClientsRegister, Adapter, Presentor} = require('../../elastic/elastic');

module.exports = function Count() {
    const register = ClientsRegister();
    const adapter = new Adapter();

    const post = async (req, res) => {
        const bodyQuery = req.body && req.body.query
        const serverParams = req.body && req.body.serverParams

        const response = await register(serverParams).count({ bodyQuery })
        const count = new Presentor().count(response);

        if (!count.isEmpty) {
            res.send({
                error: null,
                data: {
                    count
                },
                query: adapter.adaptFilters(bodyQuery)
            })
        } else {
            res.send({
                error: 'Empty result',
                data: response,
                query: adapter.adaptFilters(bodyQuery)
            })
        }
    }

    return {
        post
    };
}

'use strict';

const { host, port, version } = require('../../constants/elastic.js')
const md5 = require('md5');
const Client = require('./Client')
const ClientCacheDecorator = require('./ClientCacheDecorator')

module.exports = function ClientsRegister () {
    const clients = {};

    return (serverParams) => {
        const params = {
            host,
            port,
            version,
            ...serverParams
        }
        const hash = md5(`${params.host}${params.port}${params.params}`)

        if (clients[hash]) {
            console.log(`${hash} client get`)
            return clients[hash];
        } else {
            console.log(`${hash} client set`)
            clients[hash] = new ClientCacheDecorator(new Client(params.host, params.port, params.version));
            return clients[hash];
        }
    }
}

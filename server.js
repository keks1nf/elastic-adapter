'use strict';

const port = 8088;
const host = 'localhost';

var express = require('express')
var bodyParser = require('body-parser')
var elasticsearch = require('elasticsearch');
const { Client } = require('./data/elastic/elastic')

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/json' }))

// // parse some custom thing into a Buffer
// app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
//
// // parse an HTML body into a string
// app.use(bodyParser.text({ type: 'text/html' }))

function ElasticApi()
{
    const post = async (req, res) => {
        const c = new Client('192.168.176.2', '9200', 6.8)

        const bodyQuery = req.body && req.body.query
        const bodySource = req.body && req.body.source
        const response = await c.result({ bodyQuery, bodySource })

        if (!response.hits.hits) {
            res.send({
                error: 'Empty result',
                data: null,
                query: c.query({ bodyQuery, bodySource })
            })
        } else {
            res.send({
                error: null,
                data: response.hits.hits.map(hit => hit._source),
                query: c.query({ bodyQuery, bodySource })
            })
        }
    }

    return {
        post
    };
}

const routes = [
    {
        route: '/api/v1/elastic',
        handler: new ElasticApi()
    }
]


for (const route of routes) {
    let methods
    if (route.methods) {
        methods = route.methods;
    } else if (route.handler) {
        methods = route.handler
    } else {
        console.log('Error')
    }

    for (const methodType in methods) {
        const method = methods[methodType]
        app[methodType](route.route, method)
    }
}

app.listen(port, host);
console.log(`running on http://${host}:${port}`);

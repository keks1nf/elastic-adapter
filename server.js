'use strict';

const port = 8088;
const host = 'localhost';

var express = require('express')
var bodyParser = require('body-parser')
var elasticsearch = require('elasticsearch');


var app = express()

app.use(bodyParser.urlencoded({ extended: false }))
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/json' }))

// // parse some custom thing into a Buffer
// app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
//
// // parse an HTML body into a string
// app.use(bodyParser.text({ type: 'text/html' }))



const routes = [
    {
        route: '/api/v1/elastic/hits',
        handler: new (require('./src/routes/elastic/Hits.js')),
    }, {
        route: '/api/v1/elastic/count',
        handler: new (require('./src/routes/elastic/Count.js')),
    },
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

'use strict';

module.exports = function Presentor () {

    return {
        hits: (response) => {
            if (response.hits && response.hits.hits) {
                return response.hits.hits.map(hit => hit._source);
            } else {
                return [];
            }
        },
        count: (response) => {
            if (response && response.count) {
                return {
                    count: response.count,
                    isEmpty: false
                };
            } else {
                return {
                    count: 0,
                    isEmpty: true
                };
            }
        }
    };
}

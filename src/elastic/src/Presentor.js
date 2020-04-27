'use strict';

module.exports = function Presentor () {
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

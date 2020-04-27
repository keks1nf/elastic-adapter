'use strict';

module.exports = function Adapter () {
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

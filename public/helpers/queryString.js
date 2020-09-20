var queryString = function(query) {
    return '?' + Object.keys(query).map(k => k + '=' + query[k]).join('&');
}

export default queryString;
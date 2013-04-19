(function(_, exports) {
  var queryParams = queryParameters()

  exports.Env = {
    engine: queryParams['engine'] || 'traditional',
    test:   _.has(queryParams, 'test') || _.has(queryParams, 'grep')
  }

  function queryParameters() {
    return _.object(_.map(queryString(), function(pair) { return pair.split('=', 2) }))
  }

  function queryString() { return document.location.search.substr(1).split('&') }
})(window._, window.App)

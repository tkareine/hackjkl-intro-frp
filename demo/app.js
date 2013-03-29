(function($, _, Bacon) {
  var searchKeypress = $('.search input')
    .asEventStream('keydown')
    .debounce(500)
    .map('.currentTarget.value')
    .map($.trim)
    .filter(not(_.isEmpty))
    .skipDuplicates()

  var searchButton = $('.search button')
    .asEventStream('click')
    .map(searchInput)

  var searchTerm = searchKeypress.merge(searchButton)

  var searchResult = searchTerm
    .map(searchService)
    .flatMapLatest(Bacon.fromPromise)

  var isSearching = searchTerm.awaiting(searchResult).mapError(false)

  searchResult.assign($('.search .result'), 'text')

  isSearching.assign($('.search .controls'), 'toggleClass', 'loading')
  isSearching.assign($('.search .controls button'), 'prop', 'disabled')

  function searchInput() { return $('.search input').val() }

  function not(fun) {
    var that = this
    return function() { return !fun.apply(that, arguments) }
  }

  function searchService(query) {
    console.log("searching service: " + query)

    var deferred = new $.Deferred()

    _.delay(function() {
      if (randomSuccess()) {
        console.log("resolving search: " + query)
        deferred.resolve("result for " + query)
      } else {
        console.log("rejecting search: " + query)
        deferred.reject("failed for " + query)
      }
    }, randomTimeout())

    return deferred.promise()

    function randomTimeout() { return 500 + Math.floor(Math.random() * 1500) }

    function randomSuccess() { return Math.random() > 0.2 }
  }
})(window.$, window._, window.Bacon)

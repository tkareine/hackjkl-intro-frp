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

  searchResult.onValue(_.bind(showSearchSuccess, null, $('.search .results')))
  searchResult.onError(_.bind(showSearchFailure, null, $('.search .results')))

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
        console.log("resolving search for " + query)
        deferred.resolve(['size: ' + query.length, 'original: ' + query, 'reverted: ' + query.split('').reverse().join('')])
      } else {
        console.log("rejecting search for " + query)
        deferred.reject('backend unavailable')
      }
    }, randomTimeout())

    return deferred.promise()

    function randomTimeout() { return 500 + Math.floor(Math.random() * 1500) }

    function randomSuccess() { return Math.random() > 0.2 }
  }

  function showSearchSuccess($destination, results) {
    $destination
      .removeClass('failure')
      .addClass('success')
      .html(resultsToMarkup(results))

    function resultsToMarkup(results) { return '<ul>' + _.map(results, resultToListItem).join('') + '</li>' }

    function resultToListItem(res) { return '<li>' + res + '</li>' }
  }

  function showSearchFailure($destination, message) {
    $destination
      .removeClass('success')
      .addClass('failure')
      .text(message)
  }
})(window.$, window._, window.Bacon)

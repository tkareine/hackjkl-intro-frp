(function($, _, Bacon, App) {
  var searchKeypress = $('.search input')
    .asEventStream('keydown')
    .debounce(500)
    .map('.currentTarget.value')
    .map($.trim)
    .filter(_.not(_.isEmpty))
    .skipDuplicates()

  var searchButton = $('.search button')
    .asEventStream('click')
    .map(function() { return $('.search input').val() })

  var searchTerm = searchKeypress.merge(searchButton)

  var searchResult = searchTerm
    .map(App.searchService)
    .flatMapLatest(Bacon.fromPromise)

  var isSearching = searchTerm.awaiting(searchResult).mapError(false)

  searchResult.onValue(_.bind(App.showSearchSuccess, null, $('.search .results')))
  searchResult.onError(_.bind(App.showSearchFailure, null, $('.search .results')))

  isSearching.assign($('.search .controls'), 'toggleClass', 'loading')
  isSearching.assign($('.search .controls button'), 'prop', 'disabled')
})(window.jQuery, window._, window.Bacon, window.App)
(function($, _, Bacon, Common) {
  var searchKeypress = $('#search input')
    .asEventStream('keyup')
    .debounce(500)
    .map('.currentTarget.value')
    .map($.trim)
    .filter(_.not(_.isEmpty))
    .skipDuplicates()

  var searchButton = $('#search button')
    .asEventStream('click')
    .map(function() { return $('#search input').val() })
    .map($.trim)
    .filter(_.not(_.isEmpty))

  var searchTerm = searchKeypress.merge(searchButton)

  var searchResult = searchTerm
    .map(Common.searchService)
    .flatMapLatest(Bacon.fromPromise)

  var isSearching = searchTerm.awaiting(searchResult).mapError(false)

  searchResult.onValue(_.bind(Common.showSearchSuccess, null, $('#search .results')))
  searchResult.onError(_.bind(Common.showSearchFailure, null, $('#search .results')))

  isSearching.assign($('#search .controls'), 'toggleClass', 'loading')
  isSearching.assign($('#search .controls button'), 'prop', 'disabled')

  console.log('Loaded Bacon engine')
})(window.jQuery, window._, window.Bacon, window.App.Common)

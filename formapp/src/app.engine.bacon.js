(function($, _, Bacon, Common, exports) {
  exports.startEngine = startEngine

  function startEngine() {
    var searchInput = $('#search .controls input')
      .asEventStream('keyup')
      .debounce(500)
      .map('.currentTarget.value')
      .map($.trim)

    var searchInvalidInput = searchInput.filter(_.isEmpty)
    var searchValidInput = searchInput.filter(_.not(_.isEmpty))

    var isValidSearchInput = searchValidInput.awaiting(searchInvalidInput)

    var searchKeypress = searchValidInput.skipDuplicates()

    var searchButton = $('#search .controls button')
      .asEventStream('click')
      .map(function() { return $('#search .controls input').val() })
      .map($.trim)
      .filter(_.not(_.isEmpty))

    var searchTerm = searchKeypress.merge(searchButton)

    var searchResult = searchTerm
      .map(Common.searchService)
      .flatMapLatest(Bacon.fromPromise)

    var isSearching = searchTerm.awaiting(searchResult).mapError(false)

    searchResult.onValue(_.bind(Common.showSearchSuccess, null, $('#search .results')))
    searchResult.onError(_.bind(Common.showSearchFailure, null, $('#search .results')))

    isSearching.assign($('#search .controls .searchButton'), 'toggleClass', 'loading')

    isSearching
      .combine(isValidSearchInput, function(searching, valid) { return searching || !valid })
      .assign($('#search .controls button'), 'prop', 'disabled')
  }
})(window.jQuery, window._, window.Bacon, window.App.Common, window.App)

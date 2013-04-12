(function($, _, Rx, Common, exports) {
  exports.startEngine = startEngine

  function startEngine() {
    var searchInput = $('#search .controls input')
      .onAsObservable('keyup')
      .throttle(500)
      .select(currentTargetValueOf)
      .select($.trim)
      .publish()
      .refCount()

    var searchInvalidInput = searchInput.where(_.isEmpty)
    var searchValidInput = searchInput.where(_.not(_.isEmpty))

    var isValidSearchInput = searchValidInput.selectAs(true)
      .merge(searchInvalidInput.selectAs(false))
      .startWith(false)

    var searchKeypress = searchValidInput.distinctUntilChanged()

    var searchButton = $('#search .controls button')
      .onAsObservable('click')
      .select(function() { return $('#search .controls input').val() })
      .select($.trim)
      .where(_.not(_.isEmpty))

    var searchTerm = searchKeypress.merge(searchButton)

    var searchResult = searchTerm
      .select(searchServiceAsObservable)
      .switchLatest()
      .publish()
      .refCount()

    var isSearching = searchTerm.selectAs(true)
      .merge(searchResult.selectAs(false))
      .startWith(false)

    searchResult
      .where(isSuccessMaterial)
      .selectProperty('value')
      .selectProperty('0')
      .subscribe(_.bind(Common.showSearchSuccess, null, $('#search .results')))

    searchResult
      .where(isFailureMaterial)
      .selectProperty('exception')
      .selectProperty('0')
      .subscribe(_.bind(Common.showSearchFailure, null, $('#search .results')))

    isSearching.subscribe(_.bind($.fn.toggleClass, $('#search .controls .searchButton'), 'loading'))

    isSearching
      .combineLatest(isValidSearchInput, function(searching, valid) { return searching || !valid })
      .subscribe(_.bind($.fn.prop, $('#search .controls button'), 'disabled'))
  }

  function currentTargetValueOf(event) { return event.currentTarget.value }

  function isSuccessMaterial(notification) { return notification.kind === 'N' }

  function isFailureMaterial(notification) { return notification.kind === 'E' }

  function searchServiceAsObservable(query) {
    return $.Deferred.prototype.toObservable.apply(Common.searchService(query)).materialize()
  }
})(window.jQuery, window._, window.Rx, window.App.Common, window.App)

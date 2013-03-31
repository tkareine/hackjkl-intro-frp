(function($, _, Rx, App) {
  var searchKeypress = $('.search input')
    .onAsObservable('keydown')
    .throttle(500)
    .select(currentTargetValueOf)
    .select($.trim)
    .where(_.not(_.isEmpty))
    .distinctUntilChanged()

  var searchButton = $('.search button')
    .onAsObservable('click')
    .select(function() { return $('.search input').val() })

  var searchTerm = searchKeypress.merge(searchButton)

  var searchResult = searchTerm
    .select(searchServiceAsObservable)
    .switchLatest()
    .publish()
    .refCount()

  var isSearching = searchTerm.selectAs(true)
    .merge(searchResult.selectAs(false))
    .publish()
    .refCount()

  searchResult
    .where(isSuccessMaterial)
    .selectProperty('value')
    .selectProperty('0')
    .subscribe(_.bind(App.showSearchSuccess, null, $('.search .results')))

  searchResult
    .where(isFailureMaterial)
    .selectProperty('exception')
    .selectProperty('0')
    .subscribe(_.bind(App.showSearchFailure, null, $('.search .results')))

  isSearching.subscribe(_.bind($.fn.toggleClass, $('.search .controls'), 'loading'))
  isSearching.subscribe(_.bind($.fn.prop, $('.search .controls button'), 'disabled'))

  function currentTargetValueOf(event) { return event.currentTarget.value }

  function isSuccessMaterial(notification) { return notification.kind === 'N' }

  function isFailureMaterial(notification) { return notification.kind === 'E' }

  function searchServiceAsObservable(query) {
    return $.Deferred.prototype.toObservable.apply(App.searchService(query)).materialize()
  }
})(window.jQuery, window._, window.Rx, window.App)
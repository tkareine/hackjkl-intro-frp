(function($, _, Rx, Common) {
  var searchKeypress = $('#search input')
    .onAsObservable('keyup')
    .throttle(500)
    .select(currentTargetValueOf)
    .select($.trim)
    .where(_.not(_.isEmpty))
    .distinctUntilChanged()
    .publish()
    .refCount()

  var searchButton = $('#search button')
    .onAsObservable('click')
    .select(function() { return $('#search input').val() })
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
    .publish()
    .refCount()

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

  isSearching.subscribe(_.bind($.fn.toggleClass, $('#search .controls'), 'loading'))
  isSearching.subscribe(_.bind($.fn.prop, $('#search .controls button'), 'disabled'))

  function currentTargetValueOf(event) { return event.currentTarget.value }

  function isSuccessMaterial(notification) { return notification.kind === 'N' }

  function isFailureMaterial(notification) { return notification.kind === 'E' }

  function searchServiceAsObservable(query) {
    return $.Deferred.prototype.toObservable.apply(Common.searchService(query)).materialize()
  }

  console.log('Loaded RxJS engine')
})(window.jQuery, window._, window.Rx, window.App.Common)

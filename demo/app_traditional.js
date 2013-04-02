(function($, _, App) {
  var isUnique = IsUnique()
  var switchLatest = SwitchLatest()

  $('.search input').on('keydown', _.debounce(function(e) {
    var input = $.trim(e.currentTarget.value)
    if (!_.isEmpty(input) && isUnique(input)) onSearchTerm(input)
  }, 500))
    
  $('.search button').on('click', function() {
    var input = $.trim($('.search input').val())
    if (!_.isEmpty(input)) onSearchTerm(input)
  })

  function onSearchTerm(term) {
    toggleLoadingIndicator(true)
    toggleButtonEnabled(false)
    switchLatest(App.searchService(term))
      .done(onSearchSuccess)
      .fail(onSearchFailure)
  }

  function onSearchSuccess(results) {
    toggleLoadingIndicator(false)
    toggleButtonEnabled(true)
    App.showSearchSuccess($('.search .results'), results)
  }

  function onSearchFailure(message) {
    toggleLoadingIndicator(false)
    toggleButtonEnabled(true)
    App.showSearchFailure($('.search .results'), message)
  }

  function toggleLoadingIndicator(enable) {
    $('.search .controls').toggleClass('loading', enable)
  }

  function toggleButtonEnabled(enable) {
    $('.search .controls button').prop('disabled', !enable)
  }

  function IsUnique() {
    var last
    return function(current) {
      var isUnique = current !== last
      if (isUnique) last = current
      return isUnique
    }
  }

  function SwitchLatest() {
    var last
    return function(promise) {
      last = promise
      var deferred = $.Deferred()
      promise.done(function(e) { if (promise === last) deferred.resolve(e) })
      promise.fail(function(e) { if (promise === last) deferred.reject(e) })
      return deferred.promise()
    }
  }
})(window.jQuery, window._, window.App)

(function($, _, App) {
  var isEqualToLast = IsEqualToLast()
  var switchLatest = SwitchLatest()

  $('#search input').on('keyup', _.debounce(function(e) {
    var input = $.trim(e.currentTarget.value)
    if (!_.isEmpty(input) && !isEqualToLast(input)) onSearchTerm(input)
  }, 500))
  
  $('#search button').on('click', function() {
    var input = $.trim($('#search input').val())
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
    App.showSearchSuccess($('#search .results'), results)
  }

  function onSearchFailure(message) {
    toggleLoadingIndicator(false)
    toggleButtonEnabled(true)
    App.showSearchFailure($('#search .results'), message)
  }

  function toggleLoadingIndicator(enable) {
    $('#search .controls').toggleClass('loading', enable)
  }

  function toggleButtonEnabled(enable) {
    $('#search .controls button').prop('disabled', !enable)
  }

  function IsEqualToLast() {
    var lastNonEqual
    return function(current) {
      var isEqual = current === lastNonEqual
      if (!isEqual) lastNonEqual = current
      return isEqual
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

  console.log('Loaded traditional engine')
})(window.jQuery, window._, window.App)

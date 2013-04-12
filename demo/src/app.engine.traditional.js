(function($, _, Common, exports) {
  exports.startEngine = startEngine

  function startEngine() {
    var isEqualToLast = IsEqualToLast()
    var switchLatest = SwitchLatest()

    $('#search .controls input').on('keyup', _.debounce(function(e) {
      var input = $.trim(e.currentTarget.value)
      if (!_.isEmpty(input) && !isEqualToLast(input)) onSearchTerm(input)
    }, 500))

    $('#search .controls button').on('click', function() {
      var input = $.trim($('#search input').val())
      if (!_.isEmpty(input)) onSearchTerm(input)
    })

    function onSearchTerm(term) {
      toggleLoadingIndicator(true)
      toggleButtonEnabled(false)
      switchLatest(Common.searchService(term))
        .done(onSearchSuccess)
        .fail(onSearchFailure)
        .always(onSearchComplete)
    }
  }

  function onSearchSuccess(results) {
    Common.showSearchSuccess($('#search .results'), results)
  }

  function onSearchFailure(message) {
    Common.showSearchFailure($('#search .results'), message)
  }

  function onSearchComplete() {
    toggleLoadingIndicator(false)
    toggleButtonEnabled(true)
  }

  function toggleLoadingIndicator(enable) {
    $('#search .controls .searchButton').toggleClass('loading', enable)
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
})(window.jQuery, window._, window.App.Common, window.App)

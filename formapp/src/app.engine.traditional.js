(function($, _, Common, exports) {
  exports.startEngine = startEngine

  function startEngine() {
    var isEqualToLast = IsEqualToLast()
    var switchLatest = SwitchLatest()

    toggleButtonEnabled(false)

    $('#search .controls input').on('keyup', _.debounce(function(e) {
      var input = $.trim(e.currentTarget.value)
      var isValidInputForButton = isInputValidForButton(input)
      if (isValidInputForButton && !isEqualToLast(input)) {
        onSearchTerm(input)
        toggleButtonEnabled(false)
      } else {
        toggleButtonEnabled(isValidInputForButton)
      }
    }, 500))

    $('#search .controls button').on('click', function() {
      var input = getSearchInput()
      if (isInputValidForButton(input)) onSearchTerm(input)
      toggleButtonEnabled(false)
    })

    function getSearchInput() { return $.trim($('#search input').val()) }

    function onSearchTerm(term) {
      toggleLoadingIndicator(true)
      switchLatest(Common.searchService(term))
        .done(onSearchSuccess)
        .fail(onSearchFailure)
        .always(onSearchComplete)
    }

    function isInputValidForButton(input) { return !_.isEmpty(input) }

    function onSearchComplete() {
      toggleLoadingIndicator(false)
      toggleButtonEnabled(isInputValidForButton(getSearchInput()))
    }
  }

  function onSearchSuccess(results) {
    Common.showSearchSuccess($('#search .results'), results)
  }

  function onSearchFailure(message) {
    Common.showSearchFailure($('#search .results'), message)
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

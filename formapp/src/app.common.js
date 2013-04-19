(function($, _, exports) {
  var isMinTimeoutFlipped = false

  exports.App = {
    Common: {
      searchService:     searchService,
      queryToResult:     queryToResult,
      showSearchSuccess: showSearchSuccess,
      showSearchFailure: showSearchFailure
    }
  }

  function searchService(query) {
    console.log('> querying service: ' + query)

    var deferred = $.Deferred()

    setTimeout(function() {
      if (randomSuccess()) {
        console.log('  resolving search: ' + query)
        deferred.resolve(queryToResult(query))
      } else {
        console.log('  rejecting search: ' + query)
        deferred.reject('backend unavailable')
      }
    }, randomTimeout())

    return deferred.promise()

    function randomTimeout() {
      var min = flipMinTimeout() ? 500 : 2500
      return min + Math.floor(Math.random() * 1500)
    }

    function randomSuccess() { return Math.random() > 0.2 }

    function flipMinTimeout() {
      var last = isMinTimeoutFlipped
      isMinTimeoutFlipped = !isMinTimeoutFlipped
      return last
    }
  }

  function queryToResult(query) {
    return [
      'size: ' + query.length,
      'original: ' + query,
      'reverted: ' + query.split('').reverse().join('')
    ]
  }

  function showSearchSuccess($destination, results) {
    $destination
      .slideUp('fast')
      .promise()
      .then(function() {
        $destination
          .removeClass('failure')
          .addClass('success')
          .html(resultsToMarkup(results))
          .slideDown('fast')
      })

    function resultsToMarkup(results) { return '<ul>' + _.map(results, resultToListItem).join('') + '</li>' }

    function resultToListItem(res) { return '<li>' + res + '</li>' }
  }

  function showSearchFailure($destination, message) {
    $destination
      .slideUp('fast')
      .promise()
      .then(function() {
        $destination
          .removeClass('success')
          .addClass('failure')
          .text(message)
          .slideDown('fast')
      })
  }
})(window.jQuery, window._, window)

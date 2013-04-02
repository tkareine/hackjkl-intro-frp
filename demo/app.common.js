(function($, _) {
  var isMinTimeoutFlipped = false

  window.App = {
    searchService: function(query) {
      console.log('> querying service: ' + query)

      var deferred = $.Deferred()

      _.delay(function() {
        if (randomSuccess()) {
          console.log('  resolving search: ' + query)
          deferred.resolve([
            'size: ' + query.length,
            'original: ' + query,
            'reverted: ' + query.split('').reverse().join('')
          ])
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
    },

    showSearchSuccess: function($destination, results) {
      $destination
        .removeClass('failure')
        .addClass('success')
        .html(resultsToMarkup(results))

      function resultsToMarkup(results) { return '<ul>' + _.map(results, resultToListItem).join('') + '</li>' }

      function resultToListItem(res) { return '<li>' + res + '</li>' }
    },

    showSearchFailure: function($destination, message) {
      $destination
        .removeClass('success')
        .addClass('failure')
        .text(message)
    }
  }
})(window.jQuery, window._)

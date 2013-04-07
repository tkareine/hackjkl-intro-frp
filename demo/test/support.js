(function($, _, App, Test, Bacon, Rx) {
  Test.Support = {
    FakeBackend:       FakeBackend,
    query:             query,
    resetApp:          resetApp,
    storeResponderTo:  storeResponderTo,
    swapThrottleImpls: swapThrottleImpls,
    swapValue:         swapValue
  }

  function FakeBackend() {
    var countCalls = 0
    var responderStub

    reset()

    return {
      checkCalls:  getAndResetNumberOfCalls,
      search:      search,
      reset:       reset,
      respondWith: stubResponder
    }

    function getAndResetNumberOfCalls() {
      var num = countCalls
      countCalls = 0
      return num
    }

    function search(query) {
      countCalls += 1
      var deferred = $.Deferred()
      responderStub(query, deferred)
      return deferred.promise()
    }

    function stubResponder(stub) { responderStub = stub }

    function reset() { stubResponder(respondDefault) }

    function respondDefault(query, deferred) { deferred.resolve(App.queryToResult(query)) }
  }

  function query(input) { $('#search input').val(input).keyup() }

  function resetApp(callback) {
    $('#search').remove()
    App.load().then(function() { callback() })
  }

  function storeResponderTo(obj) {
    return function(query, deferred) {
      obj.query = query
      obj.deferred = deferred
    }
  }

  function swapThrottleImpls() {
    var _debounce = swapValue(_, 'debounce', _.__org__debounce)
    var baconDebounce = swapValue(Bacon.EventStream.prototype, 'debounce', Bacon.EventStream.prototype.__org__debounce)
    var rxThrottle = swapValue(Rx.Observable.prototype, 'throttle', Rx.Observable.prototype.__org__throttle)

    return { restore: restore }

    function restore() {
      _.map([_debounce, baconDebounce, rxThrottle], function(o) { o.restore() })
    }
  }

  function swapValue(obj, name, newValue) {
    var orgValue = obj[name]
    obj[name] = newValue
    return { restore: function() { obj[name] = orgValue } }
  }
})(window.jQuery, window._, window.App, window.Test, window.Bacon, window.Rx)

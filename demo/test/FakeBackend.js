(function($, _, Common, Test) {
  var queryToResult = _.bind(Common.queryToResult, null)

  Test.FakeBackend = FakeBackend

  function FakeBackend() {
    var countCalls = 0
    var responderStub

    reset()

    return {
      checkCalls:    getAndResetNumberOfCalls,
      queryToResult: queryToResult,
      search:        search,
      reset:         reset,
      respondWith:   stubResponder
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

    function respondDefault(query, deferred) { deferred.resolve(queryToResult(query)) }
  }
})(window.$, window._, window.App.Common, window.Test)

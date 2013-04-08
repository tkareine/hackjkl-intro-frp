(function($, _, Common, Test) {
  var queryToResult = _.bind(Common.queryToResult, null)

  Test.FakeBackend = FakeBackend

  function FakeBackend() {
    var countCalls = 0
    var responderStub

    reset()

    return {
      captureRequestTo: captureRequestTo,
      checkCalls:       getAndResetNumberOfCalls,
      reset:            reset,
      respondDefault:   respondDefault,
      respondFailureTo: respondFailureTo,
      respondSuccessTo: respondSuccessTo,
      search:           search
    }

    function captureRequestTo(obj, callback) { stubResponse(storeRequestTo(obj), callback) }

    function getAndResetNumberOfCalls() {
      var num = countCalls
      countCalls = 0
      return num
    }

    function reset() { stubResponse(respondSuccess) }

    function respondDefault(callback) { stubResponse(respondSuccess, callback) }

    function respondFailure(deferred) { deferred.reject('backend error') }

    function respondFailureTo(request) { respondFailure(request.deferred) }

    function respondSuccess(query, deferred) { deferred.resolve(queryToResult(query)) }

    function respondSuccessTo(request) { respondSuccess(request.query, request.deferred) }

    function search(query) {
      countCalls += 1
      var deferred = $.Deferred()
      responderStub(query, deferred)
      return deferred.promise()
    }

    function stubResponse(stub, callback) {
      responderStub = callback ? createAsyncStubResponse(stub, callback) : stub
    }

    // simulate network: response must arrive after all UI callbacks for making a request
    function createAsyncStubResponse(stub, callback) {
      return function() {
        var args = _.toArray(arguments)
        setTimeout(function() {
          stub.apply(null, args)
          callback()
        }, 0)
      }
    }

    function storeRequestTo(obj) {
      return function(query, deferred) {
        obj.query = query
        obj.deferred = deferred
      }
    }
  }
})(window.$, window._, window.App.Common, window.Test)

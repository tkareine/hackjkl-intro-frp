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
      respondFailure:   respondFailure,
      respondFailureTo: respondFailureTo,
      respondSuccess:   respondSuccess,
      respondSuccessTo: respondSuccessTo,
      search:           search
    }

    function captureRequestTo(obj) { return stubResponse(storeRequestTo(obj)) }

    function getAndResetNumberOfCalls() {
      var num = countCalls
      countCalls = 0
      return num
    }

    function reset() {
      countCalls = 0
      return stubResponse(succeed)
    }

    function respondFailure() { return stubResponse(fail, { async: true }) }

    function respondFailureTo(request) { fail(null, request.deferred) }

    function respondSuccess() { return stubResponse(succeed, { async: true }) }

    function respondSuccessTo(request) { succeed(request.query, request.deferred) }

    function fail(_, deferred) { deferred.reject('backend error') }

    function succeed(query, deferred) { deferred.resolve(queryToResult(query)) }

    function search(query) {
      countCalls += 1
      var deferred = $.Deferred()
      responderStub(query, deferred)
      return deferred.promise()
    }

    function stubResponse(stub, options) {
      return (options && options.async) ? setAsyncStubResponse(stub) : setSyncStubResponse(stub)
    }

    function setAsyncStubResponse(stub) {
      var deferred = $.Deferred()
      responderStub = createAsyncStubResponse(stub, deferred)
      return deferred.promise()
    }

    function setSyncStubResponse(stub) { responderStub = stub }

    // simulate network: response must arrive after all UI callbacks for making a request
    function createAsyncStubResponse(stub, deferred) {
      return function() {
        var args = arguments
        setTimeout(function() {
          stub.apply(null, args)
          deferred.resolve()
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

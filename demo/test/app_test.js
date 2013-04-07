(function($, App, TS) {
  describe('After loading application', function() {
    var Backend = TS.FakeBackend()

    before(function(done) {
      App.searchService = Backend.search
      TS.resetApp(done)
    })

    describe('when entering space for search', function() {
      before(function() {
        TS.query(' ')
      })

      it('does not perform search', expectNumCalls(0))

      it('enables search button', expectSearchButtonIs(':enabled'))

      it('hides loader', expectLoaderIsShown(false))
    })

    describe('when entering space, term, and space for search, and response has not arrived', function() {
      var backendResponder = {}

      before(function() {
        Backend.respondWith(TS.storeResponderTo(backendResponder))
        TS.query(' term ')
      })

      after(Backend.reset)

      it('performs search', expectNumCalls(1))

      it('disables search button', expectSearchButtonIs(':disabled'))

      it('shows loader', expectLoaderIsShown(true))

      describe('and when successful response arrives', function() {
        before(function() {
          backendResponder.deferred.resolve(App.queryToResult(backendResponder.query))
        })

        it('enables search button', expectSearchButtonIs(':enabled'))

        it('hides loader', expectLoaderIsShown(false))
      })
    })

    describe('when entering input and changing it back to the original within throttling period', function() {
      var throttlers

      before(function(done) {
        throttlers = TS.swapThrottleImpls()
        TS.resetApp(function() {
          TS.query('key')
          TS.query('')
          setTimeout(done, 700)
        })
      })

      after(function() { throttlers.restore() })

      it('does not perform search', expectNumCalls(0))
    })

    function expectNumCalls(num) {
      return function() { Backend.checkCalls().should.equal(num) }
    }

    function expectSearchButtonIs(status) {
      return function() { $('#search .controls button').is(status).should.be.ok }
    }

    function expectLoaderIsShown(isShown) {
      return function() { $('#search .controls').hasClass('loading').should.equal(isShown) }
    }
  })
})(window.jQuery, window.App, window.Test.Support)

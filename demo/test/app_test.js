(function($, TS, backend) {
  describe('After loading application', function() {
    before(TS.resetApp)

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
        backend.respondWith(TS.storeResponderTo(backendResponder))
        TS.query(' term ')
      })

      after(backend.reset)

      it('performs search', expectNumCalls(1))

      it('disables search button', expectSearchButtonIs(':disabled'))

      it('shows loader', expectLoaderIsShown(true))

      describe('and when successful response arrives', function() {
        before(function() {
          backendResponder.deferred.resolve(backend.queryToResult(backendResponder.query))
        })

        it('enables search button', expectSearchButtonIs(':enabled'))

        it('hides loader', expectLoaderIsShown(false))
      })
    })

/*
    describe('when entering input and changing it back to empty within throttling period (after page load)', function() {
      var throttlers

      before(function(done) {
        throttlers = TS.pauseThrottleImpls()
        TS.resetApp(function() {
          TS.query('input')
          TS.query('')
          throttlers.resumeLast()
          done()
        })
      })

      after(function() { throttlers.restore() })

      it('does not perform search', expectNumCalls(0))

      describe('and when entering input', function() {
        before(function() {
          TS.query('input')
          throttlers.resumeLast()
        })
      })
    })
*/
    function expectNumCalls(num) {
      return function() { backend.checkCalls().should.equal(num) }
    }

    function expectSearchButtonIs(status) {
      return function() { $('#search .controls button').is(status).should.be.ok }
    }

    function expectLoaderIsShown(isShown) {
      return function() { $('#search .controls').hasClass('loading').should.equal(isShown) }
    }
  })
})(window.jQuery, window.Test.Support, window.Test.fakeBackend)

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
      var request = {}

      before(function(done) {
        backend.captureRequestTo(request, done)
        TS.query(' term ')
      })

      after(backend.reset)

      it('performs search', expectNumCalls(1))

      it('trims query input', expectQueryInRequestIs('term', request))

      it('disables search button', expectSearchButtonIs(':disabled'))

      it('shows loader', expectLoaderIsShown(true))

      describe('and when successful response arrives', function() {
        before(function() {
          backend.respondSuccessTo(request)
        })

        it('enables search button', expectSearchButtonIs(':enabled'))

        it('hides loader', expectLoaderIsShown(false))

        it('shows successful results', expectResultsIs('success'))
      })
    })

    describe('when query results to backend response failure', function() {
      before(function(done) {
        backend.respondFailure(done)
        TS.query('another term')
      })

      after(backend.reset)

      it('shows failure results', expectResultsIs('failure'))
    })

    describe('when entering input and changing it back to empty within throttling period (after page load)', function() {
      var throttler

      before(function(done) {
        throttler = TS.pauseThrottling()
        TS.resetApp(function() {
          TS.query('input')
          TS.query('')
          throttler.resumeLast()
          done()
        })
      })

      after(function() { throttler.restore() })

      it('does not perform search', expectNumCalls(0))

      describe('and then entering new input and waiting for the throttling period', function() {
        before(function(done) {
          backend.respondSuccess(done)
          TS.query('input')
          throttler.resumeLast()
        })

        after(backend.reset)

        it('performs search', expectNumCalls(1))

        describe('and then changing the input and changing it back within throttling period', function() {
          before(function() {
            backend.reset()
            TS.query('inp')
            TS.query('input')
            throttler.resumeLast()
          })

          it('does not perform search', expectNumCalls(0))
        })
      })
    })

    // TODO: Add test for interleaving

    function expectNumCalls(num) {
      return function() { backend.checkCalls().should.equal(num) }
    }

    function expectQueryInRequestIs(expected, request) {
      return function() { request.query.should.equal(expected) }
    }

    function expectSearchButtonIs(status) {
      return function() { $('#search .controls button').is(status).should.be.ok }
    }

    function expectLoaderIsShown(isShown) {
      return function() { $('#search .controls').hasClass('loading').should.equal(isShown) }
    }

    function expectResultsIs(klass) {
      return function() { $('#search .results').should.have.class(klass) }
    }
  })
})(window.jQuery, window.Test.Support, window.Test.fakeBackend)

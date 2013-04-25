(function($, TS, backend) {
  describe('After loading application', function() {
    before(TS.resetApp)

    it('disables search button', expectSearchButtonIs(':disabled'))

    it('hides loader', expectSearchButtonLoaderIsShown(false))

    describe('when entering space for search', function() {
      before(function() {
        TS.query(' ')
      })

      it('does not perform search', expectNumCalls(0))

      it('disables search button', expectSearchButtonIs(':disabled'))

      it('hides loader', expectSearchButtonLoaderIsShown(false))
    })

    describe('when entering space, term, and space for search, and response has not arrived', function() {
      var request = {}

      before(function() {
        backend.captureRequestTo(request)
        TS.query(' term ')
      })

      after(backend.reset)

      it('performs search', expectNumCalls(1))

      it('trims query input', expectQueryInRequestIs('term', request))

      it('disables search button', expectSearchButtonIs(':disabled'))

      it('shows loader', expectSearchButtonLoaderIsShown(true))

      describe('and when successful response arrives', function() {
        before(function() {
          backend.respondSuccessTo(request)
        })

        it('enables search button', expectSearchButtonIs(':enabled'))

        it('hides loader', expectSearchButtonLoaderIsShown(false))

        it('shows successful results', expectResultsIs('success'))
      })
    })

    describe('when query results to backend response failure', function() {
      before(function(done) {
        backend.respondFailure().then(done)
        TS.query('another term')
      })

      after(backend.reset)

      it('shows failure results', expectResultsIs('failure'))
    })

    describe('when querying the backend twice in sequence and the response to the second last request arrives last', function() {
      before(function() {
        var firstRequest = {}
        var secondRequest = {}

        backend.captureRequestTo(firstRequest)
        TS.query('lol')
        backend.captureRequestTo(secondRequest)
        TS.query('zap')

        backend.respondSuccessTo(secondRequest)
        backend.respondSuccessTo(firstRequest)
      })

      after(backend.reset)

      it('issues two requests', expectNumCalls(2))

      it('shows the result corresponding to the last request', expectResultsContains('original: zap'))
    })

    describe('when entering input and changing it back to empty within throttling period (after page load)', function() {
      var throttler

      before(function() {
        throttler = TS.pauseThrottling()
        TS.resetApp()
        TS.query('input')
        TS.query('')
        throttler.resumeLast()
      })

      after(function() {
        throttler.restore()
        TS.resetApp()
      })

      it('does not perform search', expectNumCalls(0))

      it('disables search button', expectSearchButtonIs(':disabled'))

      describe('and then entering new input and waiting for the throttling period', function() {
        before(function(done) {
          backend.respondSuccess().then(done)
          TS.query('input')
          throttler.resumeLast()
        })

        after(backend.reset)

        it('performs search', expectNumCalls(1))

        it('enables search button', expectSearchButtonIs(':enabled'))

        describe('and then changing the input and changing it back within throttling period', function() {
          before(function() {
            TS.query('inp')
            TS.query('input')
            throttler.resumeLast()
          })

          it('does not perform search', expectNumCalls(0))

          it('enables search button', expectSearchButtonIs(':enabled'))
        })
      })
    })

    function expectNumCalls(num) {
      return function() { backend.checkCalls().should.equal(num) }
    }

    function expectQueryInRequestIs(expected, request) {
      return function() { request.query.should.equal(expected) }
    }

    function expectSearchButtonIs(status) {
      return function() { $('#search .controls button').is(status).should.be.ok }
    }

    function expectSearchButtonLoaderIsShown(isShown) {
      return function() { $('#search .controls .searchButton').hasClass('loading').should.equal(isShown) }
    }

    function expectResultsIs(klass) {
      return function() { $('#search .results').should.have.class(klass) }
    }

    function expectResultsContains(text) {
      return function() { $('#search .results').should.contain(text) }
    }
  })
})(window.jQuery, window.Test.Support, window.Test.fakeBackend)

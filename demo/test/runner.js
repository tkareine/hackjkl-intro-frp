(function($, _, Loader, Bacon, Rx) {
  window.Test = {
    loadAndRun: loadAndRunTests,
    shouldRun:  shouldRunTests
  }

  function shouldRunTests() {
    var queryParams = Loader.queryParameters()
    return _.has(queryParams, 'test') || _.has(queryParams, 'grep')
  }

  function loadAndRunTests() {
    var mocha, chai

    loadMocha()
      .then(loadChai)
      .then(loadChaiJQuery)
      .then(loadTestSupport)
      .then(setupMocha)
      .then(setupChai)
      .then(setupJQuery)
      .then(setupUnderscore)
      .then(setupBacon)
      .then(setupRxJS)
      .then(loadTests)
      .then(runMocha)

    function loadMocha() {
      Loader.loadCSS('../components/mocha/mocha.css')  // NOTE: Css gets applied later, but this should not matter
      $('body').append('<div id="mocha" />')
      return Loader.loadJS('../components/mocha/mocha.js').then(function() { mocha = window.mocha })
    }

    function loadChai() { return Loader.loadJS('../components/chai/chai.js').then(function() { chai = window.chai }) }

    function loadChaiJQuery() { return Loader.loadJS('../components/chai-jquery/chai-jquery.js') }

    function loadTestSupport() { return Loader.loadJS('test/support.js') }

    function setupMocha() { mocha.setup('bdd') }

    function setupChai() { chai.should() }

    function setupJQuery() { $.fx.off = true }

    function setupUnderscore() {
      _.__org__debounce = _.debounce
      _.debounce = function(func) { return function() { return func.apply(this, _.toArray(arguments)) } }
    }

    function setupBacon() {
      Bacon.EventStream.prototype.__org__debounce = Bacon.EventStream.prototype.debounce
      Bacon.EventStream.prototype.debounce = function() { return this }
    }

    function setupRxJS() {
      Rx.Observable.prototype.__org__throttle = Rx.Observable.prototype.throttle
      Rx.Observable.prototype.throttle = function() { return this }
    }

    function loadTests() { return Loader.loadJS('test/app_test.js') }

    function runMocha() {
      mocha
        .checkLeaks()
        .globals(['jQuery', '_'])
        .run()
    }
  }

})(window.jQuery, window._, window.Loader, window.Bacon, window.Rx)

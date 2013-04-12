(function($, _, App, Bacon, Rx, exports) {
  exports.Support = {
    pauseThrottling: pauseThrottling,
    query:           query,
    resetApp:        resetApp,
    swapValue:       swapValue
  }

  function pauseThrottling() {
    // Needs to be lazy, because only one of the engines is loaded.
    var engineArgs = ({
        bacon:       function() { return [BaconPauseStream, Bacon.EventStream.prototype, 'debounce'] },
        rx:          function() { return [RxPauseStream,    Rx.Observable.prototype,     'throttle'] },
        traditional: function() { return [FunPauseStream,   _,                           'debounce'] }
      })[App.Env.engine]()

    var pauser = engineArgs[0]()
    var swapped = swapValue.apply(null, engineArgs.slice(1).concat(pauser.combinator))

    return { resumeLast: pauser.resumeLast, restore: swapped.restore }
  }

  function BaconPauseStream() {
    var lastEvent

    return { combinator: combinator, resumeLast: resumeLast }

    function combinator() {
      var upstream = this
      return new Bacon.EventStream(function(subscriber) {
        return upstream.onValue(function(val) {
          lastEvent = function() { subscriber(new Bacon.Next(val)) }
        })
      })
    }

    function resumeLast() { if (lastEvent) lastEvent() }
  }

  function FunPauseStream() {
    var lastEvent

    return { combinator: combinator, resumeLast: resumeLast }

    function combinator(func) {
      return function() {
        var that = this
        var args = arguments
        lastEvent = function() { func.apply(that, args) }
      }
    }

    function resumeLast() { if (lastEvent) lastEvent() }
  }

  function RxPauseStream() {
    var lastEvent

    return { combinator: combinator, resumeLast: resumeLast }

    function combinator() {
      var upstream = this
      return Rx.Observable.createWithDisposable(function(observer) {
        return upstream.subscribe(function(val) {
          lastEvent = function() { observer.onNext(val) }
        })
      })
    }

    function resumeLast() { if (lastEvent) lastEvent() }
  }

  function query(input) { $('#search input').val(input).keyup() }

  function resetApp() {
    $('#search').remove()
    App.start()
  }

  function swapValue(obj, name, newValue) {
    var orgValue = obj[name]
    obj[name] = newValue
    return { restore: function() { obj[name] = orgValue } }
  }
})(window.jQuery, window._, window.App, window.Bacon, window.Rx, window.Test)

(function($, _, App, Test, Bacon, Rx) {
  Test.Support = {
    pauseThrottling: pauseThrottling,
    query:           query,
    resetApp:        resetApp,
    swapValue:       swapValue
  }

  function pauseThrottling() {
    var engineArgs = ({
        bacon:       [BaconPauseStream, Bacon.EventStream.prototype, 'debounce'],
        rx:          [RxPauseStream,    Rx.Observable.prototype,     'throttle'],
        traditional: [FunPauseStream,   _,                           'debounce']
      })[App.Env.engine]

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
    return App.load()
  }

  function swapValue(obj, name, newValue) {
    var orgValue = obj[name]
    obj[name] = newValue
    return { restore: function() { obj[name] = orgValue } }
  }
})(window.jQuery, window._, window.App, window.Test, window.Bacon, window.Rx)

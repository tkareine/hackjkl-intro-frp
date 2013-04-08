(function($, _, App, Test, Bacon, Rx) {
  Test.Support = {
    pauseThrottleImpls: pauseThrottleImpls,
    query:              query,
    resetApp:           resetApp,
    storeResponderTo:   storeResponderTo,
    swapValue:          swapValue
  }

  function pauseThrottleImpls() {
    var engineArgs = ({
        bacon:       [BaconPauseStream, Bacon.EventStream.prototype, 'debounce'],
        rx:          [Rx.Observable.prototype, 'throttle', Rx.Observable.prototype.__org__throttle],
        traditional: [_, 'debounce', _.__org__debounce]
      })[App.Env.engine]

    var pauser = engineArgs[2]()
    var swapped = swapValue.call(null, engineArgs.slice(1).concat(pauser.combinator))

    return {
      resumeLast: pauser.resumeLast,
      restore:    swapped.restore
    }
  }

  function BaconPauseStream() {
    var onValueEvents = []

    var collectorCombinator = function() {
      var upstream = this
      return new Bacon.EventStream(function(subscriber) {
        return upstream.onValue(function(val) {
          onValueEvents.push(function() { subscriber(new Bacon.Next(val)) })
        })
      })
    }

    var resumeLastEvent = function() {
      if (!_.isEmpty(onValueEvents)) _.last(onValueEvents)()
      onValueEvents.length = 0
    }

    return { combinator: collectorCombinator, resumeLast: resumeLastEvent }
  }

  function query(input) { $('#search input').val(input).keyup() }

  function resetApp(callback) {
    $('#search').remove()
    App.load().then(function() { callback() })
  }

  function storeResponderTo(obj) {
    return function(query, deferred) {
      obj.query = query
      obj.deferred = deferred
    }
  }

  function swapValue(obj, name, newValue) {
    var orgValue = obj[name]
    obj[name] = newValue
    return { restore: function() { obj[name] = orgValue } }
  }
})(window.jQuery, window._, window.App, window.Test, window.Bacon, window.Rx)

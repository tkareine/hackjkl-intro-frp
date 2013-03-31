(function(_) {
  _.mixin({
    not: function(fun) {
      var that = this
      return function() { return !fun.apply(that, _.toArray(arguments)) }
    }
  })
})(window._)

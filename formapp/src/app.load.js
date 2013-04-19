(function($, _, Loader, App, exports) {
  exports.load = load
  exports.start = start

  function load() {
    var dependencies = ({
      bacon:       [dep('bacon/dist/Bacon'), src('app.engine.bacon')],
      rx:          [dep('rxjs/rx'), dep('rxjs/rx.binding'), dep('rxjs/rx.time'), dep('rxjs-jquery/rx.jquery'), dep('rxjs-contrib/rx.contribute'), src('app.engine.rx')],
      traditional: [src('app.engine.traditional')]
    })[App.Env.engine]

    return _.reduce(dependencies, function(promise, path) {
      return promise.then(function() {
        return Loader.loadJS(path)
      })
    }, $.when())

    function dep(path) { return '../components/' + path + '.js' }

    function src(path) { return 'src/' + path + '.js' }
  }

  function start() {
    $('body').prepend($('#searchTemplate').text())
    $('#search .engine').addClass(App.Env.engine).attr('title', 'Engine: ' + App.Env.engine)
    App.startEngine()
  }
})(window.jQuery, window._, window.Loader, window.App, window.App)

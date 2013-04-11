(function($, _, App, Loader) {
  App.load = load

  function load() {
    $('body').prepend($('#searchTemplate').text())
    $('#search .engine').addClass(App.Env.engine).attr('title', 'Engine: ' + App.Env.engine)
    return Loader.loadJS('src/app.engine.' + App.Env.engine + '.js')
  }
})(window.jQuery, window._, window.App, window.Loader)

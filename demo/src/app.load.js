(function($, _, App, Loader) {
  App.load = load

  function load() {
    $('body').prepend($('#searchTemplate').text())
    return Loader.loadJS('src/app.engine.' + App.Env.engine + '.js')
  }
})(window.jQuery, window._, window.App, window.Loader)

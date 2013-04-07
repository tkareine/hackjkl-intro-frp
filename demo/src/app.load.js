(function($, _, App, Loader) {
  App.load = load

  function load() {
    $('body').prepend($('#searchTemplate').text())
    return Loader.loadJS('src/app.engine.' + getEngine() +'.js')
  }

  function getEngine() { return Loader.queryParameters()['engine'] || 'traditional' }
})(window.jQuery, window._, window.App, window.Loader)

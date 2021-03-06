(function($, _) {
  var cacheBuster = (new Date()).getTime()

  window.Loader = {
    loadCSS: loadCSS,
    loadJS:  loadJS
  }

  function loadCSS(source) {
    var linkNode = document.createElement('link')
    linkNode.type = 'text/css'
    linkNode.rel = 'stylesheet'
    linkNode.href = source + '?' + getCacheBuster()
    getFirstNodeByTag('head').appendChild(linkNode)
  }

  function loadJS(source) {
    var scriptNode = document.createElement('script')

    scriptNode.type = 'text/javascript'
    scriptNode.src = source + '?' + getCacheBuster()
    scriptNode.setAttribute('async', true)

    var deferred = $.Deferred()

    if (scriptNode.readyState) {
      scriptNode.onreadystatechange = function() {
        var readyState = scriptNode.readyState
        if (readyState === 'loaded' || readyState === 'complete') {
          scriptNode.onreadystatechange = null
          deferred.resolve()
        }
      }
    } else {
      scriptNode.onload = function() { deferred.resolve() }
    }

    getFirstNodeByTag('head').appendChild(scriptNode)

    return deferred.promise()
  }

  function getCacheBuster() { return 'bust=' + cacheBuster }

  function getFirstNodeByTag(name) { return document.getElementsByTagName(name)[0] }
})(window.jQuery, window._)

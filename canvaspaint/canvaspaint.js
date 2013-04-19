(function(Bacon) {
  var canvas = document.getElementById('canvaspaint')
  var context = canvas.getContext('2d')

  var mouseDowns = Bacon.fromEventTarget(canvas, 'mousedown').doAction('.preventDefault')
  var mouseUps = Bacon.fromEventTarget(canvas, 'mouseup').doAction('.preventDefault')
  var isPainting = mouseDowns.awaiting(mouseUps).map(toIsPainting)

  var mouseMoves = Bacon.fromEventTarget(canvas, 'mousemove')
  var paintLines = Bacon.zipAsArray(mouseMoves, mouseMoves.skip(1)).map(toPoints)

  resetContext()

  paintLines.combine(isPainting, mergeObjects).filter('.isPainting').onValue(paintLine)

  function toIsPainting(status) { return { isPainting: status } }

  function toPoints(eventPair) {
    return { start: offsetOf(eventPair[0]), end: offsetOf(eventPair[1]) }
  }

  function offsetOf(event) {
    return {
      x: event.offsetX === undefined ? event.layerX : event.offsetX,
      y: event.offsetY === undefined ? event.layerY : event.offsetY
    }
  }

  function paintLine(line) {
    context.moveTo(line.start.x, line.start.y)
    context.lineTo(line.end.x, line.end.y)
    context.stroke()
  }

  function mergeObjects() {
    var result = {}
    var objs = Array.prototype.slice.call(arguments, 0)
    var index
    var currentObj
    for (index = 0; index < objs.length; index += 1) {
      currentObj = objs[index]
      for (var key in currentObj) {
        if (currentObj.hasOwnProperty(key)) result[key] = currentObj[key]
      }
    }
    return result
  }

  function resetContext() {
    context.strokeStyle = 'orange'
    context.lineWidth = 3
    context.lineCap = 'round'
    context.beginPath()
  }
})(window.Bacon)

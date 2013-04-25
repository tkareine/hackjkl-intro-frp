# An introduction to functional reactive programming

A short presentation held at [HackJkl](http://agilejkl.com/hackjkl/) event on Mon 22nd April 2013 in Jyväskylä, Finland.

## Contents

* [slides](http://tkareine.github.io/hackjkl-intro-frp/slides/index.html)
* [canvaspaint](http://tkareine.github.io/hackjkl-intro-frp/canvaspaint/index.html), demonstrating a simple drawing application using [Bacon][Bacon]
* [formapp](http://tkareine.github.io/hackjkl-intro-frp/formapp/index.html), demonstrating the implementation and testing of form validation with Ajax requests, and comparing the traditional callback style programming against using [Bacon][Bacon] and [RxJS][RxJS]
  * [traditional engine](formapp/src/app.engine.traditional.js)
  * [Bacon engine](formapp/src/app.engine.bacon.js)
  * [RxJS engine](formapp/src/app.engine.rx.js)
  * [tests](formapp/test/app_test.js) (shared for all engines)

## License

The original content copyright &copy; 2013 Tuomas Kareinen. Released under [MIT License](http://www.opensource.org/licenses/MIT).

The rest of the content, such as some libraries and images, are copyright of the original authors. See the appropriate license files in the project file tree.

[Bacon]: https://github.com/raimohanska/bacon.js
[RxJS]: https://github.com/Reactive-Extensions/RxJS/

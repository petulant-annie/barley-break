// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"index.js":[function(require,module,exports) {
window.onload = function () {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  canvas.width = 320;
  canvas.height = 320;
  var cellSize = canvas.width / 4; // const count = document.getElementById('count');

  var game = new BarleyBreak(context, cellSize);
  game.mix(300);
  context.fillRect(0, 0, canvas.width, canvas.height); //отрисовка пустой клетки

  game.draw();

  canvas.onclick = function (e) {
    var x = (e.pageX - canvas.offsetLeft) / cellSize | 0; // клик события

    var y = (e.pageY - canvas.offsetTop) / cellSize | 0;
    event(x, y);
  };

  canvas.ontouchend = function (e) {
    var x = (e.touches[0].pageX - canvas.offsetLeft) / cellSize | 0; //тач события

    var y = (e.touches[0].pageY - canvas.offsetTop) / cellSize | 0;
    event(x, y);
  };

  function event(x, y) {
    // собираем
    game.move(x, y); // game.audio();

    context.fillRect(0, 0, canvas.width, canvas.height); //отрисовка пустой клетки

    game.draw(); //отрисовка заполненых клеток и текста

    if (game.victory()) {
      //проверка на правильность сборки
      alert("Congratulations! Finished with " + game.getClicks() + " clicks!");
      game.mix(300);
      context.fillRect(0, 0, canvas.width, canvas.height); //отрисовка пустой клетки

      game.draw(context, cellSize);
    }
  }
};

function BarleyBreak(context, cellSize) {
  var arr = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
  var clicks = 0;

  function cellView(x, y) {
    context.clearRect(x + 1, y + 1, cellSize - 2, cellSize - 2); // очистка ячейки
  }

  function numView() {
    context.font = "normal " + cellSize / 3 + "px Verdana, Geneva, sans-serif"; // стилизация чисел

    context.textAlign = "center";
    context.textBaseline = "middle"; // context.fillStyle = "#000000";
  }

  this.getNullCell = function () {
    // определение пустой ячейки
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (arr[j][i] === 0) {
          return {
            'x': i,
            'y': j
          };
        }
      }
    }
  };

  this.audio = function audio() {
    var sound = parcelRequire("audio/click.mp3");
    var audio = new Audio();
    audio.src = sound;
    audio.autoplay = true;
  };

  this.draw = function () {
    // основная отрисовка
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (arr[i][j] > 0) {
          cellView(j * cellSize, i * cellSize);
          numView();
          context.fillText(arr[i][j], j * cellSize + cellSize / 2, i * cellSize + cellSize / 2);
        }
      }
    }
  };

  this.move = function (x, y) {
    // движение
    var nullX = this.getNullCell().x;
    var nullY = this.getNullCell().y;

    if ((x - 1 == nullX || x + 1 == nullX) && y == nullY || (y - 1 == nullY || y + 1 == nullY) && x == nullX) {
      arr[nullY][nullX] = arr[y][x];
      arr[y][x] = 0;
      clicks++;
    }
  };

  this.victory = function () {
    // в случае победы
    var e = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
    var res = true;

    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (e[i][j] != arr[i][j]) {
          res = false;
        }
      }
    }

    return res;
  };

  function getRandom() {
    if (Math.floor(Math.random() * 2) === 0) {
      return true;
    }
  }

  this.mix = function (stepCount) {
    //перемешивание
    var x, y;

    for (var i = 0; i < stepCount; i++) {
      var nullX = this.getNullCell().x;
      var nullY = this.getNullCell().y;
      var hMove = getRandom();
      var upLeft = getRandom();

      if (!hMove && !upLeft) {
        y = nullY;
        x = nullX - 1;
      }

      if (hMove && !upLeft) {
        x = nullX;
        y = nullY + 1;
      }

      if (!hMove && upLeft) {
        y = nullY;
        x = nullX + 1;
      }

      if (hMove && upLeft) {
        x = nullX;
        y = nullY - 1;
      }

      if (0 <= x && x <= 3 && 0 <= y && y <= 3) {
        this.move(x, y);
      }
    }

    clicks = 0;
  };

  this.getClicks = function () {
    return clicks;
  };
}
},{}],"C:/Users/Анна/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "6362" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["C:/Users/Анна/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/barley-break.e31bb0bc.map
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],3:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

var ClickableComponent = _videoJs2['default'].getComponent('ClickableComponent');

// Default options for the plugin.
var defaults = {
  text: 'Download',
  allDownloads: false
};

/**
 * Stack CSS class names.
 * @return {String}
 */
var buildCSSClass = function buildCSSClass() {
  return 'vjs-download-button-control ' + ClickableComponent.prototype.buildCSSClass();
};

/**
 * Function to invoke when the player is ready.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
var onPlayerReady = function onPlayerReady(player, options) {
  player.addClass('vjs-download-button');

  if (!player.controlBar.childNameIndex_.hasOwnProperty('DownloadButton')) {
    (function () {

      var label = function label(src) {
        return options.allDownloads ? options.text + ' (type: ' + src.type + ')' : options.text;
      };

      var sources = options.allDownloads ? player.currentSources() : [{ src: player.currentSrc(), type: player.currentType() }];

      var linkProps = function linkProps(src) {
        return {
          className: buildCSSClass(),
          href: src.src,
          title: label(src),
          download: ''
        };
      };

      var linkAttrs = function linkAttrs(src) {
        return {
          'aria-live': 'polite',
          'aria-label': label(src)
        };
      };

      sources.forEach(function (source) {
        player.controlBar.addChild(new ClickableComponent(undefined, {
          el: ClickableComponent.prototype.createEl('a', linkProps(source), linkAttrs(source))
        }));
      });
    })();
  }
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function downloadButton
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
var downloadButton = function downloadButton(options) {
  var _this = this;

  this.ready(function () {
    onPlayerReady(_this, _videoJs2['default'].mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
_videoJs2['default'].plugin('downloadButton', downloadButton);

// Include the version number.
downloadButton.VERSION = '0.1.0';

exports['default'] = downloadButton;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
(function (global){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _globalDocument = require('global/document');

var _globalDocument2 = _interopRequireDefault(_globalDocument);

var _qunit = (typeof window !== "undefined" ? window['QUnit'] : typeof global !== "undefined" ? global['QUnit'] : null);

var _qunit2 = _interopRequireDefault(_qunit);

var _sinon = (typeof window !== "undefined" ? window['sinon'] : typeof global !== "undefined" ? global['sinon'] : null);

var _sinon2 = _interopRequireDefault(_sinon);

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

var _srcPlugin = require('../src/plugin');

var _srcPlugin2 = _interopRequireDefault(_srcPlugin);

var Player = _videoJs2['default'].getComponent('Player');

_qunit2['default'].test('the environment is sane', function (assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof _sinon2['default'], 'object', 'sinon exists');
  assert.strictEqual(typeof _videoJs2['default'], 'function', 'videojs exists');
  assert.strictEqual(typeof _srcPlugin2['default'], 'function', 'plugin is a function');
});

_qunit2['default'].module('videojs-download-button', {

  beforeEach: function beforeEach() {

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = _sinon2['default'].useFakeTimers();

    this.fixture = _globalDocument2['default'].getElementById('qunit-fixture');
    this.video = _globalDocument2['default'].createElement('video');
    this.fixture.appendChild(this.video);
    this.player = (0, _videoJs2['default'])(this.video);
  },

  afterEach: function afterEach() {
    this.player.dispose();
    this.clock.restore();
  }
});

_qunit2['default'].test('registers itself with video.js', function (assert) {
  assert.expect(2);

  assert.strictEqual(Player.prototype.downloadButton, _srcPlugin2['default'], 'videojs-download-button plugin was registered');

  this.player.downloadButton();

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  assert.ok(this.player.hasClass('vjs-download-button'), 'the plugin adds a class to the player');
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../src/plugin":3,"global/document":2}]},{},[4]);

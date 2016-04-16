'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _sighCore = require('sigh-core');

var _sighLibPluginMerge = require("sigh/lib/plugin/merge");

var _sighLibPluginMerge2 = _interopRequireDefault(_sighLibPluginMerge);

var _sighCoreLibStream = require("sigh-core/lib/stream");

exports['default'] = function (op) {
  for (var _len = arguments.length, pipelines = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    pipelines[_key - 1] = arguments[_key];
  }

  var bufferedCount = 0;
  var buffer = [];
  var pushToBuffer = undefined;
  var buffering = true;
  var promise = new _bluebird2['default'](function (resolve) {
    pushToBuffer = function push(events) {
      buffer = buffer.concat(events);
      if (events.every(function (event) {
        return event.initPhase;
      })) {
        bufferedCount++;
      }
      if (bufferedCount === pipelines.length) {
        buffering = false;
        resolve(buffer);
      }
    };
  });
  return _sighLibPluginMerge2['default'].apply(undefined, [op].concat(pipelines)).then(function (stream) {
    return stream.flatMapLatest(function (events) {
      if (buffering) {
        pushToBuffer(events);
        return (0, _sighCoreLibStream.toFileSystemState)(_sighCore.Bacon.fromPromise(promise));
      } else {
        return _sighCore.Bacon.constant(events);
      }
    });
  });
};

module.exports = exports['default'];
//# sourceMappingURL=index.js.map
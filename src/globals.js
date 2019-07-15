function keyMirror(keys) {
  return keys.reduce(
    function(previous, current) {
      return Object.assign(previous, { [current]: current });
    },
    {}
  );
}

const builtinGlobals = Object.keys(require('globals').builtin);
const browserGlobals = Object.keys(require('globals').browser);
const extraGlobals = ["clearImmediate", "setImmediate"];

module.exports = keyMirror([].concat(builtinGlobals, browserGlobals, extraGlobals));

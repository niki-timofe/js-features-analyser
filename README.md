# babel-es-runtime-features-extractor

## How to use

`x anaylse --file ./your-file.js`

## Limitations
This project does not compile syntax at all.

Create a bundle which targets the syntax level you support (ES3/5/2017/2019) and then pass that bundle through this tool.

The reason to create the bundle first is because if you are compiling your code down to another syntax level, the compiled code will contain different built-ins than the uncompiled version. E.G. Compiling `async function() { await 7;}` to ES5 will make the compiled output have `Promise` in it, which this tool will then detect.

This project does not know the types that are within the code being analysed, which means that when it sees a name of a builtin being used, it will add all the builtins which match that name to it's output. E.G. Analysing `[1].reduce(function(){})` will not only detect that `Array.prototype.reduce` was used, it would also incorrectly detect that `Int8Array.prototype.reduce`, `Uint8Array.prototype.reduce`, `Uint8ClampedArray.prototype.reduce`, `Int16Array.prototype.reduce`, `Uint16Array.prototype.reduce`, `Int32Array.prototype.reduce`, `Uint32Array.prototype.reduce`, `Float32Array.prototype.reduce`, and `Float64Array.prototype.reduce` were also used.

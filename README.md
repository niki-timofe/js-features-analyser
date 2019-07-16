# babel-es-runtime-features-extractor

This project does not compile syntax at all.

Create a bundle which targets the syntax level you support (ES3/5/2017/2019) and then pass that bundle through this tool.

The reason to create the bundle first is because if you are compiling your code down to another syntax level, the compiled code will contain different built-ins than the uncompiled version. E.G. Compiling `async function() { await 7;}` to ES5 will make the compiled output have `Promise` in it, which this tool will then detect.

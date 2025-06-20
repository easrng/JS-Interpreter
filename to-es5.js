const babel = require("@babel/core");
const esbuild = require("esbuild");
module.exports = (code) => {
  try {
    return esbuild.buildSync({
      stdin: {
        contents: babel.transformSync(code, {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: "supports es5",
                useBuiltIns: "usage",
                corejs: "3.6.5",
              },
            ],
          ],
          sourceType: "script",
        }).code,
        sourcefile: process.argv.at(-1),
        resolveDir: __dirname,
      },
      bundle: true,
      format: "iife",
      write: false,
      target: "es5",
    }).outputFiles[0].text;
  } catch (e) {
    if (e instanceof SyntaxError) {
      return `throw new SyntaxError(${JSON.stringify(e.message)})`;
    }
  }
};

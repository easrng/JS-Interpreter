const babel = require("@babel/core");
const esbuild = require("esbuild");
module.exports = (code) =>
  esbuild.buildSync({
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
      }).code,
      sourcefile: process.argv.at(-1),
      resolveDir: __dirname,
    },
    bundle: true,
    format: "iife",
    write: false,
    target: "es5",
  }).outputFiles[0].text;

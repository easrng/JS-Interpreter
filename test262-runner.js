#!/usr/bin/env node
const { readFileSync } = require("fs");
const { Interpreter } = require("./interpreter.js");

const myInterpreter = new Interpreter(
  readFileSync(process.argv.at(-1), "utf-8").replace(
    /function print.+}};(?!")/m,
    `function print() { console.log.apply(console, arguments); } var $262 = { global: globalThis, gc: function () { return gc(); }, createRealm: function createRealm(options) { throw new Error('createRealm() not yet supported.'); }, evalScript: function evalScript(code) { throw new Error('evalScript() not yet supported.'); }, getGlobal: function getGlobal(name) { return this.global[name]; }, setGlobal: function setGlobal(name, value) { this.global[name] = value; }, destroy: function destroy() {}, IsHTMLDDA: function IsHTMLDDA() { return {}; }, source: "", get agent() { throw new Error('agent.* not yet supported.'); }};`
  ),
  function (interpreter, globalObject) {
    interpreter.setProperty(globalObject, "globalThis", globalObject);
    const consoleObject = interpreter.createObjectProto(
      interpreter.OBJECT_PROTO
    );
    interpreter.setProperty(
      consoleObject,
      "log",
      interpreter.createNativeFunction(console.log)
    );
    interpreter.setProperty(globalObject, "console", consoleObject);
  }
);
const runToCompletion = function () {
  try {
    if (myInterpreter.run()) {
      setTimeout(runToCompletion, 10);
    }
  } catch (e) {
    //console.log(`Uncaught exception: [${e.name}] ${e.message}`)
    //console.log(`Uncaught exception: ${e.name ? `[${e.name}] `:''}${e.message||e}`)
    console.log(
      `Uncaught exception: ${
        e?.name
          ? `[${e.name}] ${e.message}`
          : `[unknown] ${require("util").inspect(e, { breakLength: Infinity })}`
      }`
    );
    //console.error(e?.stack)
  }
};
runToCompletion();

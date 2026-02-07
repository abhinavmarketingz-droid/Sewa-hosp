const ts = require("typescript")

const compilerOptions = {
  jsx: ts.JsxEmit.Preserve,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  sourceMap: false,
}

module.exports = {
  preprocess(text, filename) {
    const output = ts.transpileModule(text, {
      compilerOptions,
      fileName: filename,
      reportDiagnostics: false,
    })
    return [output.outputText]
  },
  postprocess(messages) {
    return messages[0] ?? []
  },
  supportsAutofix: true,
}

import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

const MonacoEditorView = () => {
  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
    />
  );
};

export default MonacoEditorView;

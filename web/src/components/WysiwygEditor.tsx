// @ts-nocheck XXX ckeditor5 doesn't come with types

import React from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import CustomEditor from "ckeditor5-build-inline-custom";

import "./WysiwygEditor.css";

const config = {
  toolbar: [
    "specialCharacters",
    "|",
    "bold",
    "italic",
    "link",
    "blockQuote",
    "|",
    "imageUpload",
    "insertTable",
    "mediaEmbed",
    "|",
    "undo",
    "redo",
  ],
  balloonToolbar: [
    "heading",
    "|",
    "bulletedList",
    "numberedList",
    "indent",
    "outdent",
  ],
};

const initEditor = (editor) => {
  editor.plugins.get("SpecialCharacters").addItems("Emoji", [
    { title: "smiley face", character: "😊" },
    { title: "rocket", character: "🚀" },
    { title: "wind blowing face", character: "🌬️" },
    { title: "floppy disk", character: "💾" },
    { title: "heart", character: "❤️" },
  ]);
};

export const WysiwygEditor = React.memo<{
  registerClear: (clear: () => void) => void;
  onChange: (data: string) => void;
}>(({ registerClear, onChange }) => (
  <CKEditor
    editor={CustomEditor}
    config={config}
    onInit={(editor) => {
      registerClear(() => {
        editor.setData("");
      });
      initEditor(editor);
    }}
    onChange={(_event, editor) => {
      const data = editor.getData();
      onChange(data);
    }}
  />
));

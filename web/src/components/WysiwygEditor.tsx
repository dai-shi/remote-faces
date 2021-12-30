// @ts-nocheck XXX ckeditor5 doesn't come with types

import { memo } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomEditor from "@daishi/ckeditor5-build-inline-custom";

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
  link: {
    addTargetToExternalLinks: true,
  },
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

export const WysiwygEditor = memo<{
  registerClear: (clear: () => void) => void;
  onChange: (data: string) => void;
  onMetaEnter: () => void;
}>(({ registerClear, onChange, onMetaEnter }) => (
  <CKEditor
    editor={CustomEditor}
    config={config}
    onReady={(editor) => {
      const onKeydown = (event: KeyboardEvent) => {
        if (event.metaKey && event.code === "Enter") {
          onMetaEnter();
        }
      };
      editor.sourceElement.addEventListener("keydown", onKeydown);
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

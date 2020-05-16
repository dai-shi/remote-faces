// @ts-nocheck XXX ckeditor5 doesn't come with types

import React from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import CustomEditor from "@ckeditor/ckeditor5-build-inline";

export const WysiwygEditor = React.memo<{
  registerClear: (clear: () => void) => void;
  onChange: (data: string) => void;
}>(({ registerClear, onChange }) => {
  return (
    <CKEditor
      editor={CustomEditor}
      onInit={(editor) => {
        registerClear(() => {
          editor.setData("");
        });
      }}
      onChange={(_event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
});

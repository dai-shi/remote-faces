import { useCallback, useState } from "react";

export const useInputAvatar = (initialAvator: string) => {
  const [avatar, setAvatar] = useState(initialAvator);

  const onChangeAvatar = useCallback((files: FileList | null) => {
    const file = files && files[0];
    if (!file) {
      return;
    }
    if (file.size > 16 * 1024) {
      window.alert(`Too large: ${file.size}`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  return [avatar, onChangeAvatar] as const;
};

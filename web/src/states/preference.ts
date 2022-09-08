import { proxy } from "valtio";

type Preference = {
  photoSize?: number;
};

export const preferenceState = proxy<Preference>({});

// ProfileData
import { SETUSERDATA } from "./ActionType";
export const setUserProfileData = (value) => ({
  type: SETUSERDATA,
  payload: value,
});

// Reset
import { RESET } from "./ActionType";
export const reset = (value) => ({
  type: RESET,
  payload: value,
});

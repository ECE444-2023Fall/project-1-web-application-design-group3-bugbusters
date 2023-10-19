// ProfileData
import { SETUSERDATA } from "./ActionType";
export const setUserData = (value) => ({
  type: SETUSERDATA,
  payload: value,
});

// Reset
import { RESET } from "./ActionType";
export const reset = (value) => ({
  type: RESET,
  payload: value,
});

// ProfileData
import { SETUSERDATA } from "./ActionType";
export const setUserData = (value) => ({
  type: SETUSERDATA,
  payload: value,
});

// CurrentEventData
import { SETCURRENTEVENTDATA } from "./ActionType";
export const setCurrentEventData = (value) => ({
  type: SETCURRENTEVENTDATA,
  payload: value,
});

// Reset
import { RESET } from "./ActionType";
export const reset = (value) => ({
  type: RESET,
  payload: value,
});

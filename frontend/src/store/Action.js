// ProfileData
import { SETUSERPROFILEDATA } from "./ActionType";
export const setUserProfileData = (value) => ({
  type: SETUSERPROFILEDATA,
  payload: value,
});

// Reset
import { RESET } from "./ActionType";
export const reset = (value) => ({
  type: RESET,
  payload: value,
});

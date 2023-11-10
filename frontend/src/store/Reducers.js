import { SETUSERPROFILEDATA, RESET, SETCURRENTEVENTDATA } from "./ActionType";

const initialState = {
  primaryColor: "#25355A",
  secondaryColor: "#007FA3",
  contrastColor: "white",
  userProfileData: {},
  currentEventData: {},
};

export const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETUSERPROFILEDATA:
      return {
        ...state,
        userProfileData: { ...state.userProfileData, ...action.payload },
      };
    case SETCURRENTEVENTDATA:
      return {
        ...state,
        currentEventData: { ...state.currentEventData, ...action.payload },
      };
    case RESET:
      return { ...initialState };
    default:
      return state;
  }
};

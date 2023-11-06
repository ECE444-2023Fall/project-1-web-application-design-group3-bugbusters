import { SETUSERPROFILEDATA, RESET, SETCURRENTEVENTDATA } from "./ActionType";

const initialState = {
  primaryColor: "#25355A",
  secondaryColor: "#007FA3",
  contrastColor: "white",
  userData: {},
  currentEventData: {},
};

export const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETUSERPROFILEDATA:
      return {
        ...state,
        userData: { ...state.userData, ...action.payload },
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

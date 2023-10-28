import { SETUSERDATA, RESET } from "./ActionType";

const initialState = {
  primaryColor: "#25355A",
  secondaryColor: "#007FA3",
  contrastColor: "white",
  userData: {},
};

export const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETUSERDATA:
      return {
        ...state,
        userData: { ...state.userData, ...action.payload },
      };
    case RESET:
      return { ...initialState };
    default:
      return state;
  }
};

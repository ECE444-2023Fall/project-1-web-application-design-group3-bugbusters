import { SETUSERDATA, RESET } from "./ActionType";

const initialState = {
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

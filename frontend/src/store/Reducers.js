import { SETAUTHDATA, SETUSERDATA, RESET } from "./ActionType";

const initialState = {
  authData: {},
  userData: {},
};

export const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETAUTHDATA:
      return { ...state, authData: { ...state.authData, ...action.payload } };
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

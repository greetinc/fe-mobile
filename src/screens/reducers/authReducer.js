const initialState = {
    token: null,
    userId: null,
    fullName: null,
    error: null,
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          token: action.payload.token,
          userId: action.payload.userId,
          fullName: action.payload.fullName,
          error: null,
        };
      case 'LOGIN_FAILURE':
        return {
          ...state,
          error: action.payload.error,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;
  
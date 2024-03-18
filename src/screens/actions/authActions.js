export const loginSuccess = (token, userId, fullName) => ({
    type: 'LOGIN_SUCCESS',
    payload: { token, userId, fullName },
  });
  
  export const loginFailure = (error) => ({
    type: 'LOGIN_FAILURE',
    payload: { error },
  });
import{
    USER_CHECK_REQUEST,
    USER_CHECK_SUCCESS,
    USER_CHECK_FAIL,
    USER_CHECK_RESET,
    CHECK_UPDATE_REQUEST,
    CHECK_UPDATE_SUCCESS,
    CHECK_UPDATE_FAIL,
    CHECK_UPDATE_RESET

} from '../constants/checkConstants'


export const userSubmitReducer = (state = { check: [] }, action) => {
  switch (action.type) {
    case USER_CHECK_REQUEST:
      return { loading: true }
    case USER_CHECK_SUCCESS:
      return { loading: false, check: action.payload }
    case USER_CHECK_FAIL:
      return { loading: false, error: action.payload }
    case USER_CHECK_RESET:
      return { check: [] }
    default:
      return state
  }
}

  export const checkUpdateReducer = (state = { check: {} }, action) => {
    switch (action.type) {
      case CHECK_UPDATE_REQUEST:
        return { loading: true };
      case CHECK_UPDATE_SUCCESS:
        return { loading: false, success: true, check: action.payload };
      case CHECK_UPDATE_FAIL:
        return { loading: false, error: action.payload };
      case CHECK_UPDATE_RESET:
        return {};
      default:
        return state;
    }
  };

  
  
  
  
  
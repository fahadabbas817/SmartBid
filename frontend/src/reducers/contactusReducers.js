import{
    USER_FORM_REQUEST,
    USER_FORM_SUCCESS,
    USER_FORM_FAIL,
    USER_FORMLIST_REQUEST,
    USER_FORMLIST_SUCCESS,
    USER_FORMLIST_FAIL,
    USER_FORMLIST_RESET
} from '../constants/contactusConstants'

export const userContactusReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_FORM_REQUEST:
        return { loading: true }
      case USER_FORM_SUCCESS:
        return { loading: false, userInfo: action.payload }
      case USER_FORM_FAIL:
        return { loading: false, error: action.payload }
      default:
        return state
    }
  }

  export const userFormListReducer = (state = { contactus: [] }, action) => {
    switch (action.type) {
      case USER_FORMLIST_REQUEST:
        return { loading: true }
      case USER_FORMLIST_SUCCESS:
        return { loading: false, contactus: action.payload }
      case USER_FORMLIST_FAIL:
        return { loading: false, error: action.payload }
      case USER_FORMLIST_RESET:
        return { contactus: [] }
      default:
        return state
    }
  }
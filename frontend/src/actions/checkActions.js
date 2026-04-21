import axios from 'axios'
import { logout } from './userActions'
import{
    USER_CHECK_REQUEST,
    USER_CHECK_SUCCESS,
    USER_CHECK_FAIL,
    CHECK_UPDATE_REQUEST,
    CHECK_UPDATE_SUCCESS,
    CHECK_UPDATE_FAIL,
    

} from '../constants/checkConstants'



export const checkSubmit = () => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_CHECK_REQUEST,
      })
  
      const {
        userLogin: { userInfo },
      } = getState()
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
  
      const { data } = await axios.get(`/api/check`, config)
      console.log(data)
  
      dispatch({
        type: USER_CHECK_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      if (message === 'Not authorized, token failed') {
        dispatch(logout())
      }
      dispatch({
        type: USER_CHECK_FAIL,
        payload: message,
      })
    }
  }


  export const updateCheck = (isCheck) => async (dispatch) => {
    try {
      dispatch({ type: CHECK_UPDATE_REQUEST });
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      const { data } = await axios.put('/api/check/update', { isCheck }, config);
  
      dispatch({ type: CHECK_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: CHECK_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
import axios from 'axios'

import {USER_FORM_FAIL,
        USER_FORM_SUCCESS,
        USER_FORM_REQUEST,
        USER_FORMLIST_REQUEST,
        USER_FORMLIST_SUCCESS,
        USER_FORMLIST_FAIL} 
        from '../constants/contactusConstants'
import { logout } from './userActions'



export const contactList = (name, email, subject,text) => async (dispatch) => {
    try {
      dispatch({
        type: USER_FORM_REQUEST,
      })
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
  
      const { data } = await axios.post(
        '/api/contactus',
        { name, email, subject,text },
        config
      )
  
      dispatch({
        type: USER_FORM_SUCCESS,
        payload: data,
      })
  
      
  
      localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
      dispatch({
        type: USER_FORM_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }


  export const listContactus = () => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_FORMLIST_REQUEST,
      })
  
      const {
        userLogin: { userInfo },
      } = getState()
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
  
      const { data } = await axios.get(`/api/contactus`, config)
  
      dispatch({
        type: USER_FORMLIST_SUCCESS,
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
        type: USER_FORMLIST_FAIL,
        payload: message,
      })
    }
  }
  
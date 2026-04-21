import axios from 'axios';

import {USER_LIVE_FAIL,
        USER_LIVE_SUCCESS,
        USER_LIVE_REQUEST,
        USER_LIVELIST_REQUEST,
        USER_LIVELIST_SUCCESS,
        USER_LIVELIST_FAIL,
        LATEST_BID_REQUEST,
        LATEST_BID_SUCCESS,
        LATEST_BID_FAIL,
        AUCTION_DELETE_REQUEST,
        AUCTION_DELETE_SUCCESS,
        AUCTION_DELETE_FAIL} 
        from '../constants/liveConstants'
        
import { logout } from './userActions'



export const LiveList = (email,price) => async (dispatch) => {
    try {
      dispatch({
        type: USER_LIVE_REQUEST,
      })
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
  
      const { data } = await axios.post(
        '/api/live/all',
        { email,price },
        config
      )
  
      dispatch({
        type: USER_LIVE_SUCCESS,
        payload: data,
      })
  
      
  
      localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
      dispatch({
        type: USER_LIVE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }


  export const listLive = () => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_LIVELIST_REQUEST,
      })
  
      const {
        userLogin: { userInfo },
      } = getState()
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
  
      const { data } = await axios.get(`/api/live/all`, config)
      dispatch({
        type: USER_LIVELIST_SUCCESS,
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
        type: USER_LIVELIST_FAIL,
        payload: message,
      })
    }
  }
  
  export const latestBid = () => async (dispatch, getState) => {
    try {
      dispatch({
        type: LATEST_BID_REQUEST,
      });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const response = await axios.get('/api/live/highest', config); // Make the AJAX call
  
      dispatch({
        type: LATEST_BID_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
  
      if (message === 'Not authorized, token failed') {
        dispatch(logout()); // Dispatch the logout action if needed
      }
  
      dispatch({
        type: LATEST_BID_FAIL,
        payload: message,
      });
    }
  };
  

  export const deleteAll = () => async (dispatch, getState) => {
    try {
      dispatch({
        type: AUCTION_DELETE_REQUEST,
      });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      await axios.delete('/api/live/clear', config);
  
      dispatch({
        type: AUCTION_DELETE_SUCCESS,
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === 'Not authorized, token failed') {
        dispatch(logout());
      }
      dispatch({
        type: AUCTION_DELETE_FAIL,
        payload: message,
      });
    }
  };
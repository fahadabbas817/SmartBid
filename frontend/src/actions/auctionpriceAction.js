import axios from 'axios'

import {AUCTION_CREATE_REQUEST,
        AUCTION_CREATE_SUCCESS,
        AUCTION_CREATE_FAIL,
        AUCTION_LATEST_REQUEST,
        AUCTION_LATEST_SUCCESS,
        AUCTION_LATEST_FAIL,
      } 
        from '../constants/auctionpriceConstants'
        
import { logout } from './userActions'

export const createAuction = (name,baseprice) => async (dispatch) => {
    try {
      dispatch({
        type: AUCTION_CREATE_REQUEST,
      })
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
  
      const { data } = await axios.post(
        '/api/auctionprice/update',
        { name,baseprice },
        config
      )
  
      dispatch({
        type: AUCTION_CREATE_SUCCESS,
        payload: data,
      })
  
      localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
      dispatch({
        type: AUCTION_CREATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

  export const latestAuction = () => async (dispatch, getState) => {
    try {
      dispatch({
        type: AUCTION_LATEST_REQUEST,
      })
  
      const {
        userLogin: { userInfo },
      } = getState()
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
  
      const { data } = await axios.get(`/api/auctionprice/update`, config)
  
      dispatch({
        type: AUCTION_LATEST_SUCCESS,
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
        type: AUCTION_LATEST_FAIL,
        payload: message,
      })
    }
  }
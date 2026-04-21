import {AUCTION_CREATE_REQUEST,
AUCTION_CREATE_SUCCESS,
AUCTION_CREATE_FAIL,
AUCTION_CREATE_RESET,
AUCTION_LATEST_REQUEST,
AUCTION_LATEST_SUCCESS,
AUCTION_LATEST_FAIL,
AUCTION_LATEST_RESET

} from '../constants/auctionpriceConstants'


export const productAuctionReducer = (state = {}, action) => {
    switch (action.type) {
      case AUCTION_CREATE_REQUEST:
        return { loading: true }
      case AUCTION_CREATE_SUCCESS:
        return { loading: false, success: true, product: action.payload }
      case AUCTION_CREATE_FAIL:
        return { loading: false, error: action.payload }
      case AUCTION_CREATE_RESET:
        return {}
      default:
        return state
    }
  }


  export const userLatestReducer = (state = { auctionprice: [] }, action) => {
    switch (action.type) {
      case AUCTION_LATEST_REQUEST:
        return { loading: true }
      case AUCTION_LATEST_SUCCESS:
        return { loading: false, auctionprice: action.payload }
      case AUCTION_LATEST_FAIL:
        return { loading: false, error: action.payload }
      case AUCTION_LATEST_RESET:
        return { auctionprice: [] }
      default:
        return state
    }
  }
  
  
  
  
  
  
  
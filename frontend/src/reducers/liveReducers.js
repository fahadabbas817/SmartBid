import{
    USER_LIVE_REQUEST,
    USER_LIVE_SUCCESS,
    USER_LIVE_FAIL,

    USER_LIVELIST_REQUEST,
    USER_LIVELIST_SUCCESS,
    USER_LIVELIST_FAIL,
    USER_LIVELIST_RESET,

    LATEST_BID_REQUEST,
    LATEST_BID_SUCCESS,
    LATEST_BID_FAIL,
    LATEST_BID_RESET,

    AUCTION_DELETE_REQUEST,
    AUCTION_DELETE_SUCCESS,
    AUCTION_DELETE_FAIL,
    AUCTION_DELETE_RESET,
    
} from '../constants/liveConstants'

export const userLiveReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_LIVE_REQUEST:
        return { loading: true }
      case USER_LIVE_SUCCESS:
        return { loading: false, userInfo: action.payload }
      case USER_LIVE_FAIL:
        return { loading: false, error: action.payload }
      default:
        return state
    }
  }

  export const userLiveListReducer = (state = { live: [] }, action) => {
    switch (action.type) {
      case USER_LIVELIST_REQUEST:
        return { loading: true }
      case USER_LIVELIST_SUCCESS:
        return { loading: false, live: action.payload }
      case USER_LIVELIST_FAIL:
        return { loading: false, error: action.payload }
      case USER_LIVELIST_RESET:
        return { live: [] }
      default:
        return state
    }
  }

  export const userBidReducer = (state = { live: [] }, action) => {
  switch (action.type) {
    case LATEST_BID_REQUEST:
      return { loading: true }
    case LATEST_BID_SUCCESS:
      return { loading: false, live: action.payload }
    case LATEST_BID_FAIL:
      return { loading: false, error: action.payload }
    case LATEST_BID_RESET:
      return { live: [] }
    default:
      return state
  }
}

export const auctionDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case AUCTION_DELETE_REQUEST:
      return { loading: true };
    case AUCTION_DELETE_SUCCESS:
      return { loading: false, success: true };
    case AUCTION_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case AUCTION_DELETE_RESET:
      return {};
    default:
      return state;
  }
};
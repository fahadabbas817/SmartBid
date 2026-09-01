import { SET_CURRENCY } from '../constants/currencyConstants'

export const currencyReducer = (state = { code: 'USD', rate: 1 }, action) => {
  switch (action.type) {
    case SET_CURRENCY:
      const rate = action.payload === 'PKR' ? 280 : 1;
      return { code: action.payload, rate }
    default:
      return state
  }
}

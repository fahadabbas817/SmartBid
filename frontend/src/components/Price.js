import React from 'react';
import { useSelector } from 'react-redux';

const Price = ({ amount }) => {
  const currencyState = useSelector((state) => state.currency) || { code: 'USD', rate: 1 };
  const { code, rate } = currencyState;

  if (amount === undefined || amount === null) {
    return null;
  }

  const convertedAmount = Number(amount) * rate;
  
  // Format based on currency
  const formatted = code === 'PKR' 
    ? convertedAmount.toLocaleString('en-PK', { maximumFractionDigits: 0 }) 
    : convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <span>
      {code === 'PKR' ? 'Rs ' : '$'}{formatted}
    </span>
  );
};

export default Price;

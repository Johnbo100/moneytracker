import React from "react";

const Total = props => {
  const total = props.expense.reduce(
    (prevValue, currentValue) => prevValue + currentValue.expense,
    0
  );
  return <p>Totalzzz: {total}</p>;
};

export default Total;